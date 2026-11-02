import { z } from 'zod';
const idx=z.number().int().min(0).max(5);
const profile=z.object({
 name:z.string().trim().min(1).max(35),xp:z.number().int().min(0).max(10000000),
 done:z.array(idx).max(6).refine(v=>new Set(v).size===v.length),
 days:z.record(z.string().regex(/^\d{4}-\d{2}-\d{2}$/),z.number().int().min(0).max(10000)).refine(v=>Object.keys(v).length<=10000),
 reviews:z.record(z.string().regex(/^[0-5]$/),z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
 mistakes:z.array(z.object({l:idx,q:z.number().int().min(0).max(5)}).refine(m=>m.q<(m.l===0?6:3))).max(60),
 goal:z.union([z.literal(30),z.literal(60),z.literal(90)]),
 reading:z.record(z.string().regex(/^[0-5]$/),z.number().int().min(0).max(20)).optional(),
});
export const progressSchema=z.object({active:z.union([z.literal(0),z.literal(1)]),profiles:z.array(profile).length(2),topics:z.array(z.string().trim().min(1).max(100)).max(100).optional()});
export const writeSchema=z.object({revision:z.number().int().nonnegative(),state:progressSchema});
