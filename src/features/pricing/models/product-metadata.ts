import { z } from 'zod';

export const priceCardVariantSchema = z.enum(['basic', 'pro', 'enterprise']);

/**
 * Metadata stored on each Stripe product and synced to our DB. Configure these
 * keys on the product in the Stripe dashboard.
 *
 * - `price_card_variant`: controls card styling/emphasis (basic | pro | enterprise)
 * - `prompts_per_month`: a number as a string, or "unlimited"
 * - `support_level`: "email" | "priority"
 * - `index` (optional, used only for ordering in the query): "0", "1", "2"
 */
export const productMetadataSchema = z
  .object({
    price_card_variant: priceCardVariantSchema.default('basic'),
    prompts_per_month: z.string().optional(),
    support_level: z.enum(['email', 'priority']).default('email'),
  })
  .transform((data) => ({
    priceCardVariant: data.price_card_variant,
    promptsPerMonth: data.prompts_per_month === 'unlimited' ? 'unlimited' : data.prompts_per_month,
    supportLevel: data.support_level,
  }));

export type ProductMetadata = z.infer<typeof productMetadataSchema>;
export type PriceCardVariant = z.infer<typeof priceCardVariantSchema>;
