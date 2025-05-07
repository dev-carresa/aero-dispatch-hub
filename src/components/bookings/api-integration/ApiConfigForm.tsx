
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const apiConfigSchema = z.object({
  api_key: z.string().min(1, "API key is required"),
});

type ApiConfigFormValues = z.infer<typeof apiConfigSchema>;

interface ApiConfigFormProps {
  apiName: string;
  keyName: string;
  onConfigSaved: () => void;
}

export function ApiConfigForm({ apiName, keyName, onConfigSaved }: ApiConfigFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<ApiConfigFormValues>({
    resolver: zodResolver(apiConfigSchema),
    defaultValues: {
      api_key: "",
    },
  });
  
  const onSubmit = async (data: ApiConfigFormValues) => {
    try {
      setIsLoading(true);
      
      // Update the API key in the api_integrations table
      const { error } = await supabase
        .from('api_integrations')
        .update({ 
          key_value: data.api_key,
          status: 'disconnected', // Reset status until tested
          last_tested: new Date().toISOString()
        })
        .eq('key_name', keyName);
        
      if (error) throw error;
      
      toast.success(`${apiName} API key saved successfully`);
      onConfigSaved();
      form.reset();
    } catch (error: any) {
      console.error("Error saving API key:", error);
      toast.error(error.message || `Failed to save ${apiName} API key`);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">{apiName} API Configuration</CardTitle>
        <CardDescription>Enter your {apiName} API credentials</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="api_key"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Key</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder={`Enter your ${apiName} API key`}
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save API Key"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
