
import { ApiCategory } from "../models/apiSettings";

export const apiCategories: ApiCategory[] = [
  {
    name: "payment",
    description: "Payment processing integrations",
    apis: [
      {
        title: "Stripe Payments",
        description: "Connect to Stripe for payment processing",
        keys: {
          stripePublishableKey: {
            label: "Publishable Key",
            placeholder: "Enter Stripe publishable key",
            info: "Publishable keys are safe to expose in your frontend code."
          },
          stripeSecretKey: {
            label: "Secret Key",
            placeholder: "Enter Stripe secret key",
            info: "Secret keys should only be stored on your server.",
            sensitive: true
          }
        }
      },
      {
        title: "Payzone Integration",
        description: "Connect to Payzone payment services",
        keys: {
          payzoneApiKey: {
            label: "API Key",
            placeholder: "Enter Payzone API key",
            sensitive: true
          },
          payzoneSecretKey: {
            label: "Secret Key",
            placeholder: "Enter Payzone secret key",
            sensitive: true
          }
        }
      }
    ]
  },
  {
    name: "services",
    description: "Essential service integrations",
    apis: [
      {
        title: "Booking System Integration",
        description: "Connect to the main booking platform",
        keys: {
          bookingSystemProductKey: {
            label: "Product Key",
            placeholder: "Enter product key",
            sensitive: true
          },
          bookingSystemSecretKey: {
            label: "Secret Key", 
            placeholder: "Enter secret key",
            sensitive: true
          }
        }
      },
      {
        title: "Currency Exchange API",
        description: "Real-time currency conversion rates",
        keys: {
          currencyExchangeApiKey: {
            label: "API Key",
            placeholder: "Enter currency exchange API key",
            sensitive: true
          }
        }
      }
    ]
  },
  {
    name: "mapping",
    description: "Location and mapping services",
    apis: [
      {
        title: "Google Maps API",
        description: "Maps, location services and route planning",
        keys: {
          googleMapsApiKey: {
            label: "Maps JavaScript API Key",
            placeholder: "Enter Google Maps API key",
            sensitive: true
          }
        }
      }
    ]
  },
  {
    name: "travel",
    description: "Travel and transportation services",
    apis: [
      {
        title: "Flight Tracking Service",
        description: "Real-time flight status and tracking",
        keys: {
          flightTrackingApiKey: {
            label: "API Key",
            placeholder: "Enter flight tracking API key",
            sensitive: true
          }
        }
      }
    ]
  },
  {
    name: "reviews",
    description: "Customer review integrations",
    apis: [
      {
        title: "TrustPilot Reviews",
        description: "Integrate TrustPilot review system",
        keys: {
          trustPilotApiKey: {
            label: "API Key",
            placeholder: "Enter TrustPilot API key",
            sensitive: true
          }
        }
      }
    ]
  },
  {
    name: "other",
    description: "Other API integrations",
    apis: [
      {
        title: "RapidAPI",
        description: "Access multiple APIs through RapidAPI",
        keys: {
          rapidApiKey: {
            label: "API Key",
            placeholder: "Enter RapidAPI key",
            sensitive: true
          }
        }
      }
    ]
  }
];
