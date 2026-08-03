'use client';

import { useTransition } from "react";
import { Check } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createCheckoutAction } from "@/features/pricing/actions/create-checkout-action";

interface PricingCardProps {
  product: any;
  billingInterval: 'month' | 'year';
  currentPriceId?: string | null;
}

export function PricingCard({ product, billingInterval, currentPriceId }: PricingCardProps) {
  const price = product.prices?.find((p: any) => p.interval === billingInterval);
  const isPopular = product.name === "Pro";
  const isCurrentPlan = price.id === currentPriceId;

  const displayPrice = `$${(price.unit_amount / 100).toFixed(0)}`;
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

  const [isPending, startTransition] = useTransition();

  return (
    <div className="relative flex h-full flex-col rounded-2xl border bg-white p-8 shadow-sm transition-all hover:shadow-md">
      
      {isPopular && (
        <div className="absolute -top-3 left-1/2 z-10 -translate-x-1/2">
          <Badge className="bg-orange-500 px-4 py-1 text-sm font-medium text-white hover:bg-orange-500">
            Most Popular
          </Badge>
        </div>
      )}

      {/* Header */}
      <div className="mb-2 text-xl font-semibold text-black">{product.name}</div>

      {/* Price */}
      <div className="mb-6 flex min-h-[4.5rem] flex-col justify-center">
        <div className="flex items-baseline">
          <span className="text-5xl font-bold tracking-tighter text-black">{displayPrice}</span>
          <span className="ml-1 text-lg text-neutral-500">{priceLabel}</span>
        </div>
      </div>

      {/* Features */}
      <div className="flex flex-1 flex-col">
        <ul className="mb-8 flex-1 space-y-3 text-sm text-neutral-700">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        {/* Button sticks to bottom */}
        <div className="mt-auto">
          <Button
            disabled={isPending}
            className={`w-full text-base font-medium ${
              isCurrentPlan
                ? "border border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-100"
                : isPopular
                ? "bg-orange-500 text-white hover:bg-orange-600"
                : "bg-primary text-white hover:bg-primary/90"
            }`}
            onClick={() => {
              if (isCurrentPlan) {
                window.location.href = "/manage-subscription";
                return;
              }

              startTransition(() => {
                createCheckoutAction(price.id);
              });
            }}
          >
            {isCurrentPlan ? "Manage plan" : isPending ? "Redirecting..." : "Get Started"}
          </Button>
        </div>
      </div>
    </div>
  );
}