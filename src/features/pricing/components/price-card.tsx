'use client';

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

interface PricingCardProps {
  product: any;
  billingInterval: 'month' | 'year';
}

export function PricingCard({ product, billingInterval }: PricingCardProps) {
  const price = product.prices?.find(
    (p: any) => p.interval === billingInterval
  );

  const isPopular = product.name === "Pro";
  const hasNumericPrice = Boolean(price?.unit_amount);
  const isContactPlan = !hasNumericPrice;

  const displayPrice = hasNumericPrice
    ? `$${(price!.unit_amount / 100).toFixed(0)}`
    : "Custom";

  const priceLabel = billingInterval === "year" ? "/year" : "/month";

  const planFeatures: Record<string, string[]> = {
    Starter: [
      "100 prompts per month",
      "Access to the PromptMystic engine",
      "Optimized for Claude & GPT-4o",
      "Email support",
      "Basic prompt templates",
    ],
    Pro: [
      "Unlimited prompts",
      "Access to the PromptMystic engine",
      "Optimized for Claude & GPT-4o",
      "Priority email support",
      "Advanced prompt templates",
      "Prompt history & organization",
    ],
    Premium: [
      "Unlimited prompts",
      "Access to the PromptMystic engine",
      "Optimized for Claude & GPT-4o",
      "Priority email support",
      "Advanced prompt engineering tools",
      "Custom prompt packs",
      "Early access to new features",
    ],
  };

  const features = planFeatures[product.name] || [];

  return (
    <div className="relative flex h-full flex-col rounded-2xl border bg-white p-8 shadow-sm transition-all hover:shadow-md">
      
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
          <Badge className="bg-orange-500 px-4 py-1 text-sm font-medium text-white hover:bg-orange-500">
            Most Popular
          </Badge>
        </div>
      )}

      <div className="flex flex-col">
        <div className="mb-2 text-xl font-semibold text-black">{product.name}</div>

        {/* Price Display */}
        <div className="mb-6 flex min-h-[4.5rem] flex-col justify-center">
          {isContactPlan ? (
            <>
              <span className="text-3xl font-bold tracking-tight text-black">Let's talk</span>
              <span className="mt-1 text-sm text-neutral-600">
                Custom pricing for your team
              </span>
            </>
          ) : (
            <div className="flex items-baseline">
              <span className="text-5xl font-bold tracking-tighter text-black">{displayPrice}</span>
              <span className="ml-1 text-lg text-neutral-500">{priceLabel}</span>
            </div>
          )}
        </div>

        {/* Features */}
        <ul className="mb-8 flex-1 space-y-3 text-sm text-neutral-700">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <Button
        className={`w-full text-base font-medium ${
          isPopular 
            ? "bg-orange-500 hover:bg-orange-600 text-white" 
            : isContactPlan
              ? "bg-neutral-900 hover:bg-black text-white"
              : "bg-primary hover:bg-primary/90"
        }`}
        onClick={async () => {
          if (isContactPlan) {
            window.location.href = "mailto:patrick@montereyminerals.com?subject=Premium%20plan%20enquiry";
            return;
          }
          const priceId = (price as any)?.id;
          if (priceId) {
            console.log("Checkout clicked with price ID:", priceId);
          }
        }}
      >
        {isContactPlan ? "Contact Us" : "Get Started"}
      </Button>
    </div>
  );
}