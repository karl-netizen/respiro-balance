-- Step 1: Remove duplicate sessions (keep oldest version of each duplicate)

-- Remove duplicate "5 Min Relaxation Meditation" sessions (keep oldest: 1befa040-fd41-438f-bb6c-55eac21ad151)
DELETE FROM meditation_content WHERE id IN (
  '01d4bc5b-462f-475f-8b7c-507fb40a53b8',
  '9a3e42f3-3ef5-4820-a06e-5c3065f34bfc',
  '1f99a0ff-88d5-4501-b1c5-ae785fbd8fbc',
  'f55c2ee9-f231-4df8-b7a4-536321c663cc',
  '76138de8-1604-42c3-af37-126c8605d4b6'
);

-- Remove duplicate "5 Minutes Guided Meditation for Unease" sessions (keep oldest: bee9e404-fef8-48d5-9bc2-5e2f9f35b55c)
DELETE FROM meditation_content WHERE id IN (
  '983aaeb2-4ade-4590-a465-09d23672c6ec',
  '99004e7d-07cc-402a-ba47-0fc23104ea62',
  'ac271e3e-2c53-4bfc-b71b-2328eb18c64c'
);

-- Remove duplicate "deep meditation 192828" sessions (keep oldest: 1778afc1-bfdf-49a4-b9fb-2a71fe920655)
DELETE FROM meditation_content WHERE id IN (
  '7cdcd0d4-45e0-42e2-8293-2e2cb94701d4',
  '90c0bcb9-1538-4f5f-a139-303220ebd9ea',
  '461cc9e7-493c-41ca-8f81-36837eb45133'
);

-- Remove duplicate "finding tranquility in chaos" sessions (keep oldest: e1157c6e-3a73-4e44-b7ab-5ddabcb7354c)
DELETE FROM meditation_content WHERE id IN (
  '3a8cf222-6067-4bce-adbf-5d60a39d610b',
  'a0348982-e6fd-438c-a446-b012eccd40f4',
  'c05515d0-8347-471b-981b-8b1a7b898772'
);

-- Remove duplicate "General Stress an Anxiety 31406809 1715477809" sessions (keep oldest: d2e91be0-85ec-4a84-a5b9-55c91b0b03e1)
DELETE FROM meditation_content WHERE id IN (
  '98659ab1-0f85-4260-8d98-191776a25906',
  'b73655a5-8647-4390-a889-ebc4c6e9423d'
);

-- Remove duplicate "Sleep 31406408 1715473171" sessions (keep oldest: 28a34b5c-a07a-490f-a7c8-1584c032a345)
DELETE FROM meditation_content WHERE id IN (
  '120647c6-25c6-4fbd-8034-becbacfdbaea'
);

-- Remove duplicate "the magic of meditation" sessions (keep oldest: ef30280e-1622-4e23-879b-f977b731f806)
DELETE FROM meditation_content WHERE id IN (
  'f013a89e-202c-41d5-a2bc-5e7e7b8e5b5b'
);

-- Remove duplicate "user 1752322683139 AffirmationsVoiceover" sessions (keep oldest: 25541f28-279b-439d-9631-9716cb6e9256)
DELETE FROM meditation_content WHERE id IN (
  '6e3dec35-173a-4244-9a6e-3cf8784218af'
);

-- Step 2: Clean up poor quality titles and update with better names
UPDATE meditation_content SET 
  title = 'Deep Meditation Practice',
  description = 'A profound guided meditation to deepen your mindfulness practice and inner awareness.'
WHERE id = '1778afc1-bfdf-49a4-b9fb-2a71fe920655';

UPDATE meditation_content SET 
  title = 'Finding Tranquility in Chaos',
  description = 'Learn to find peace and calm in the midst of life''s challenges and uncertainties.'
WHERE id = 'e1157c6e-3a73-4e44-b7ab-5ddabcb7354c';

UPDATE meditation_content SET 
  title = 'Stress and Anxiety Relief',
  description = 'A gentle guided meditation specifically designed to reduce stress and ease anxiety.'
WHERE id = 'd2e91be0-85ec-4a84-a5b9-55c91b0b03e1';

UPDATE meditation_content SET 
  title = 'Peaceful Sleep Meditation',
  description = 'A calming meditation to help prepare your mind and body for restful sleep.',
  category = 'Sleep'
WHERE id = '28a34b5c-a07a-490f-a7c8-1584c032a345';

UPDATE meditation_content SET 
  title = 'The Magic of Meditation',
  description = 'Discover the transformative power of meditation and its impact on your daily life.'
WHERE id = 'ef30280e-1622-4e23-879b-f977b731f806';

UPDATE meditation_content SET 
  title = 'Daily Affirmations Practice',
  description = 'A guided meditation incorporating positive affirmations to boost self-confidence and inner strength.'
WHERE id = '25541f28-279b-439d-9631-9716cb6e9256';

UPDATE meditation_content SET 
  title = 'Respect and Self-Compassion',
  description = 'A mindfulness practice focused on developing respect for yourself and cultivating self-compassion.'
WHERE id = 'e3d35407-2d21-4916-8ecb-a1897916cbc2';

UPDATE meditation_content SET 
  title = '5-Minute Relaxation',
  description = 'A quick and effective relaxation meditation perfect for busy schedules and stress relief.'
WHERE id = '1befa040-fd41-438f-bb6c-55eac21ad151';

UPDATE meditation_content SET 
  title = 'Guided Meditation for Unease',
  description = 'A gentle practice to help calm feelings of unease and restore emotional balance.'
WHERE id = 'bee9e404-fef8-48d5-9bc2-5e2f9f35b55c';

-- Step 3: Assign proper subscription tiers based on content quality and complexity

-- FREE PLAN - Basic introductory content (5 sessions)
UPDATE meditation_content SET subscription_tier = 'free' WHERE id IN (
  '0ce0bd2e-bdfe-4970-b085-d30d9275f1e8', -- Introduction to Meditation
  '668a48be-ee8a-4df3-9a37-4398a4318119', -- Basic Breathing Exercise  
  '0424b77c-c2f3-4cab-83b3-60ef76f058d7', -- Evening Wind Down
  '3a0c65e5-6cb8-4866-8911-28d79c5272c8', -- 5-Minute Stress Relief
  '1befa040-fd41-438f-bb6c-55eac21ad151'  -- 5-Minute Relaxation
);

-- PREMIUM PLAN - Intermediate content (additional 10 sessions)
UPDATE meditation_content SET subscription_tier = 'premium' WHERE id IN (
  '00e821d9-d992-480f-8d20-0a1e5bf0cafd', -- Morning Energy Boost
  'bee9e404-fef8-48d5-9bc2-5e2f9f35b55c', -- Guided Meditation for Unease
  '1778afc1-bfdf-49a4-b9fb-2a71fe920655', -- Deep Meditation Practice
  'e1157c6e-3a73-4e44-b7ab-5ddabcb7354c', -- Finding Tranquility in Chaos
  'd2e91be0-85ec-4a84-a5b9-55c91b0b03e1', -- Stress and Anxiety Relief
  '28a34b5c-a07a-490f-a7c8-1584c032a345', -- Peaceful Sleep Meditation
  'ef30280e-1622-4e23-879b-f977b731f806', -- The Magic of Meditation
  '64082a6f-9081-47a1-8c7f-e358c56c4c67', -- Anxiety Relief Session
  'fcbc2442-d1c5-4bbe-ad30-938ceebb6b70', -- Power Nap Session
  '7ff90855-f50a-4818-a2b2-f441f43f9463'  -- Laser Focus Meditation
);

-- PREMIUM PRO PLAN - Advanced content (additional 8 sessions)
UPDATE meditation_content SET subscription_tier = 'premium_pro' WHERE id IN (
  '0353a154-c94d-4298-9d3b-013839b4ced5', -- Mindful Eating Practice
  '365e7cb0-0783-4bcb-8818-af5b9678649d', -- Walking Meditation Guide
  'e542acd8-2466-46e2-a9ba-5315df15723d', -- Deep Stress Release
  'c15db249-2add-4c66-a7ff-fd8c1d5e9244', -- Complete Body Scan
  '8d9057bb-b5e0-4138-8ca8-a6e8fba63b50', -- Loving Kindness Practice
  'b23c1c88-145c-473e-b2c2-470ef17e77f3', -- Advanced Breathing Mastery
  '25541f28-279b-439d-9631-9716cb6e9256', -- Daily Affirmations Practice
  'e3d35407-2d21-4916-8ecb-a1897916cbc2'  -- Respect and Self-Compassion
);

-- PREMIUM PLUS PLAN - Professional/workplace content
UPDATE meditation_content SET subscription_tier = 'premium_plus' WHERE id IN (
  'a985e38f-459c-4071-b36a-f3fbeb4dba19'  -- Workplace Calm
);