-- AI Digital MySQL Database Dump
-- Compatible with XAMPP phpMyAdmin / MySQL

CREATE DATABASE IF NOT EXISTS `ai_digital` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `ai_digital`;

-- --------------------------------------------------------
-- Table structure for table `pricing_plans`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `pricing_plans`;
CREATE TABLE `pricing_plans` (
  `id` VARCHAR(36) NOT NULL,
  `category` VARCHAR(50) NOT NULL,
  `platform` VARCHAR(50) DEFAULT NULL,
  `badge_class` VARCHAR(50) DEFAULT NULL,
  `level` VARCHAR(50) NOT NULL,
  `pill_class` VARCHAR(50) DEFAULT NULL,
  `price` VARCHAR(50) NOT NULL,
  `period` VARCHAR(50) DEFAULT NULL,
  `features` TEXT NOT NULL,
  `button_text` VARCHAR(50) DEFAULT 'Select Plan',
  `is_popular` TINYINT(1) DEFAULT '0',
  `service_name` VARCHAR(100) DEFAULT NULL,
  `plan_parameter` VARCHAR(255) DEFAULT NULL,
  `tag_class` VARCHAR(50) DEFAULT NULL,
  `is_highlight` TINYINT(1) DEFAULT '0',
  `highlight_styles` TEXT DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `pricing_plans`
INSERT INTO `pricing_plans` VALUES 
('g_basic', 'googlePlans', 'Google Ads', 'gg-badge', 'Basic Plan', 'basic-pill', '4999', '/month', '["Google Ads","Creative - 3","AI Video - 1","Reels/Shorts - 1","Weekly Report"]', 'Select Plan', 0, 'Performance Marketing', 'Google Ads - Basic (₹4999/mo)', NULL, 0, NULL),
('g_standard', 'googlePlans', 'Google Ads', 'gg-badge', 'Standard Plan', 'standard-pill', '13499', '/3 months', '["Google Ads","Creative - 9","AI Video - 3","Reels/Shorts - 3","Weekly Report"]', 'Select Plan', 1, 'Performance Marketing', 'Google Ads - Standard (₹13499/3mo)', NULL, 0, NULL),
('g_premium', 'googlePlans', 'Google Ads', 'gg-badge', 'Premium Plan', 'premium-pill', '23999', '/6 months', '["Google Ads","Creative - 18","AI Video - 6","Reels/Shorts - 6","Weekly Report"]', 'Select Plan', 0, 'Performance Marketing', 'Google Ads - Premium (₹23999/6mo)', NULL, 0, NULL),
('fb_basic', 'facebookPlans', 'Meta Ads', 'fb-badge', 'Basic', 'basic-pill', '2499', '/month', '["Meta Ads","Creative - 3","AI Video - 1","Reels/Shorts - 1","Weekly Report"]', 'Select Plan', 0, 'Performance Marketing', 'Meta Ads - Basic (₹2499/mo)', NULL, 0, NULL),
('fb_standard_monthly', 'facebookPlans', 'Meta Ads', 'fb-badge', 'Standard', 'standard-pill', '3999', '/month', '["Meta Ads","Creative - 5","AI Video - 2","Reels/Shorts - 3","Weekly Report"]', 'Select Plan', 1, 'Performance Marketing', 'Meta Ads - Standard (₹3999/mo)', NULL, 0, NULL),
('fb_standard', 'facebookPlans', 'Meta Ads', 'fb-badge', 'Premium', 'standard-pill', '6899', '/3 months', '["Meta Ads","Creative - 9","AI Video - 3","Reels/Shorts - 3","Weekly Report"]', 'Select Plan', 0, 'Performance Marketing', 'Meta Ads - Premium (₹6899/3mo)', NULL, 0, NULL),
('fb_premium', 'facebookPlans', 'Meta Ads', 'fb-badge', 'Platinum', 'premium-pill', '12599', '/6 months', '["Meta Ads","Creative - 18","AI Video - 6","Reels/Shorts - 6","Weekly Report"]', 'Select Plan', 0, 'Performance Marketing', 'Meta Ads - Platinum (₹12599/6mo)', NULL, 0, NULL),
('comb_basic', 'combinePlans', 'Meta + Google Ads', 'multi-badge', 'Basic', 'basic-pill', '6999', '/month', '["Meta Ads + Google Ads","Creative - 7","AI Video - 2","Reels/Shorts - 5","Weekly Report"]', 'Select Plan', 0, 'Performance Marketing', 'Combine - Basic (₹6999/mo)', NULL, 0, NULL),
('comb_standard', 'combinePlans', 'Meta + Google Ads', 'multi-badge', 'Standard', 'standard-pill', '19499', '/3 months', '["Meta Ads + Google Ads","Creative - 21","AI Video - 6","Reels/Shorts - 15","Weekly Report"]', 'Select Plan', 1, 'Performance Marketing', 'Combine - Standard (₹19499/3mo)', NULL, 0, NULL),
('comb_premium', 'combinePlans', 'Meta + Google Ads', 'multi-badge', 'Premium', 'premium-pill', '35999', '/6 months', '["Meta Ads + Google Ads","Creative - 42","AI Video - 6","Reels/Shorts - 30","Weekly Report"]', 'Select Plan', 0, 'Performance Marketing', 'Combine - Premium (₹35999/6mo)', NULL, 0, NULL),
('wlif025b38', 'websitePlans', NULL, NULL, 'Static', NULL, '7499', NULL, '[{"icon":"language","text":"Domain Name"},{"icon":"cloud_queue","text":"Hosting"},{"icon":"description","text":"1 Page Design"},{"icon":"settings_backup_restore","text":"Maintenance"}]', 'Select Plan', 0, 'Web Development', 'Static Website (₹7499)', 'static-tag', 0, NULL),
('upvnq4eclhl', 'websitePlans', NULL, NULL, 'Dynamic', NULL, '14999', NULL, '[{"icon":"language","text":"Domain Name"},{"icon":"cloud_queue","text":"Hosting"},{"icon":"description","text":"10 Page Design"},{"icon":"settings_backup_restore","text":"Maintenance"}]', 'Select Plan', 0, 'Web Development', 'Dynamic Website (₹14999)', 'dynamic-tag', 0, NULL),
('70hropyn13u', 'creativePacks', NULL, NULL, 'Starter', NULL, '599', NULL, '[{"icon":"image","text":"5 Creatives"},{"icon":"brush","text":"Social Media Sizes"},{"icon":"folder_zip","text":"PNG & JPG Formats"},{"icon":"check_circle","text":"Standard delivery time"}]', 'Select Plan', 0, 'SEO Growth', 'Creative Packs - Starter (5 for ₹599)', 'static-tag', 0, NULL),
('1h0r6fthwlqh', 'creativePacks', NULL, NULL, 'Growth', NULL, '1099', NULL, '[{"icon":"image","text":"10 Creatives"},{"icon":"brush","text":"Ad Banner Formats"},{"icon":"folder_zip","text":"PNG & JPG Formats"},{"icon":"check_circle","text":"Standard delivery time"}]', 'Select Plan', 0, 'SEO Growth', 'Creative Packs - Growth (10 for ₹1099)', 'static-tag', 0, NULL),
('iis9djdpfvs', 'creativePacks', NULL, NULL, 'Value', NULL, '1499', NULL, '[{"icon":"image","text":"15 Creatives"},{"icon":"brush","text":"Brand Style Match"},{"icon":"folder_zip","text":"Source Files Included"},{"icon":"check_circle","text":"Standard delivery time"}]', 'Select Plan', 0, 'SEO Growth', 'Creative Packs - Value (15 for ₹1499)', 'static-tag', 1, '{"card":{"borderColor":"#2563EB","borderWidth":"2px","position":"relative","overflow":"hidden"},"tag":{"backgroundColor":"#EBF3FF","color":"#2563EB"},"icon":{"color":"#2563EB"},"button":{"backgroundColor":"#2563EB"}}'),
('4fup4cqc4q5', 'creativePacks', NULL, NULL, 'Standard', NULL, '1899', NULL, '[{"icon":"image","text":"20 Creatives"},{"icon":"brush","text":"Multi-Platform Sizes"},{"icon":"folder_zip","text":"Source Files Included"},{"icon":"check_circle","text":"Standard delivery time"}]', 'Select Plan', 0, 'SEO Growth', 'Creative Packs - Standard (20 for ₹1899)', 'static-tag', 0, NULL),
('cla9x3gfvw', 'creativePacks', NULL, NULL, 'Pro', NULL, '2699', NULL, '[{"icon":"image","text":"30 Creatives"},{"icon":"brush","text":"Complete Ad Sets"},{"icon":"folder_zip","text":"Source Files Included"},{"icon":"check_circle","text":"Standard delivery time"}]', 'Select Plan', 0, 'SEO Growth', 'Creative Packs - Pro (30 for ₹2699)', 'static-tag', 0, NULL),
('0skxtis9sk7', 'aiVideoPlans', NULL, NULL, 'Starter Plan', NULL, '4,500', NULL, '[{"icon":"video_library","text":"5 AI Videos"},{"icon":"check_circle","text":"Perfect for getting started"}]', 'Select Plan', 0, 'AI Video Production', 'AI Video - Starter Plan (5 Videos for ₹4500)', 'static-tag', 0, NULL),
('p6pk00m966', 'aiVideoPlans', NULL, NULL, 'Growth Plan', NULL, '5,950', NULL, '[{"icon":"video_library","text":"7 AI Videos"},{"icon":"check_circle","text":"Ideal for growing brands"}]', 'Select Plan', 0, 'AI Video Production', 'AI Video - Growth Plan (7 Videos for ₹5950)', 'static-tag', 1, '{"card":{"borderColor":"#FD7E14","borderWidth":"2px","position":"relative","overflow":"hidden"},"tag":{"backgroundColor":"#FFF0EA","color":"#FD7E14"},"icon":{"color":"#FD7E14"},"button":{"backgroundColor":"#FD7E14"}}'),
('22w0etoexmy', 'aiVideoPlans', NULL, NULL, 'Pro Plan', NULL, '8,000', NULL, '[{"icon":"video_library","text":"10 AI Videos"},{"icon":"check_circle","text":"Best for maximum impact"}]', 'Select Plan', 0, 'AI Video Production', 'AI Video - Pro Plan (10 Videos for ₹8000)', 'static-tag', 0, NULL);

-- --------------------------------------------------------
-- Table structure for table `portfolio_items`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `portfolio_items`;
CREATE TABLE `portfolio_items` (
  `id` VARCHAR(36) NOT NULL,
  `section` VARCHAR(50) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `category` VARCHAR(100) DEFAULT NULL,
  `industry` VARCHAR(100) DEFAULT NULL,
  `metric` VARCHAR(50) DEFAULT NULL,
  `metric_label` VARCHAR(100) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `tags` TEXT DEFAULT NULL,
  `accent` VARCHAR(50) DEFAULT NULL,
  `icon` VARCHAR(50) DEFAULT NULL,
  `src` VARCHAR(255) DEFAULT NULL,
  `type` VARCHAR(50) DEFAULT NULL,
  `global_index` INT DEFAULT NULL,
  `thumbnail` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `portfolio_items`
INSERT INTO `portfolio_items` (`id`, `section`, `title`, `category`, `industry`, `metric`, `metric_label`, `description`, `tags`, `accent`, `icon`, `src`, `type`, `global_index`) VALUES 
('s1', 'showcase', 'Property Listing Website', 'Website & SEO', 'Real Estate', '+142%', 'Organic traffic', 'A conversion-focused property portal with SEO pages, lead capture, and campaign-ready landing sections.', '[\"Static Website\",\"Local SEO\",\"Lead Forms\"]', 'blue', 'language', NULL, NULL, NULL),
('s2', 'showcase', 'AI Property Promo', 'AI Videos', 'Real Estate', '3.8x', 'Ad return', 'AI-assisted property video concepting and short-form creative built for paid and organic distribution.', '[\"AI Video\",\"Reels\",\"Paid Ads\"]', 'orange', 'movie', NULL, NULL, NULL),
('s3', 'showcase', 'Finance Dashboard', 'Website & SEO', 'Finance', '+78%', 'Qualified leads', 'A modern dashboard-style web experience for finance education, investor trust, and measurable inquiries.', '[\"Dashboard UI\",\"Content SEO\",\"Analytics\"]', 'blue', 'query_stats', NULL, NULL, NULL),
('f1', 'featured', 'Property Listing Website', 'Website & SEO', 'Real Estate', NULL, NULL, 'Websites, campaigns, AI property promotions, creative branding, and real estate reels.', NULL, NULL, NULL, NULL, NULL, NULL),
('f2', 'featured', 'Real Estate Lead Campaign', 'Campaigns', 'Real Estate', NULL, NULL, 'Websites, campaigns, AI property promotions, creative branding, and real estate reels.', NULL, NULL, NULL, NULL, NULL, NULL),
('f3', 'featured', 'AI Property Promo', 'AI Videos', 'Real Estate', NULL, NULL, 'Websites, campaigns, AI property promotions, creative branding, and real estate reels.', NULL, NULL, NULL, NULL, NULL, NULL),
('f4', 'featured', 'Real Estate Instagram Reel', 'Reels', 'Real Estate', NULL, NULL, 'Websites, campaigns, AI property promotions, creative branding, and real estate reels.', NULL, NULL, NULL, NULL, NULL, NULL),
('f5', 'featured', 'School Website', 'Website & SEO', 'Education', NULL, NULL, 'Educational websites, admission campaigns, student-focused creatives, and promotional reels.', NULL, NULL, NULL, NULL, NULL, NULL),
('f6', 'featured', 'Admission Campaign', 'Campaigns', 'Education', NULL, NULL, 'Educational websites, admission campaigns, student-focused creatives, and promotional reels.', NULL, NULL, NULL, NULL, NULL, NULL),
('f7', 'featured', 'Educational AI Video', 'AI Videos', 'Education', NULL, NULL, 'Educational websites, admission campaigns, student-focused creatives, and promotional reels.', NULL, NULL, NULL, NULL, NULL, NULL),
('f8', 'featured', 'Student Awareness Reel', 'Reels', 'Education', NULL, NULL, 'Educational websites, admission campaigns, student-focused creatives, and promotional reels.', NULL, NULL, NULL, NULL, NULL, NULL),
('f9', 'featured', 'Hospital Website', 'Website & SEO', 'Healthcare', NULL, NULL, 'Healthcare websites, awareness campaigns, AI medical videos, and promotional content.', NULL, NULL, NULL, NULL, NULL, NULL),
('f10', 'featured', 'Healthcare Campaign', 'Campaigns', 'Healthcare', NULL, NULL, 'Healthcare websites, awareness campaigns, AI medical videos, and promotional content.', NULL, NULL, NULL, NULL, NULL, NULL),
('f11', 'featured', 'AI Medical Promo', 'AI Videos', 'Healthcare', NULL, NULL, 'Healthcare websites, awareness campaigns, AI medical videos, and promotional content.', NULL, NULL, NULL, NULL, NULL, NULL),
('f12', 'featured', 'Healthcare Branding Creative', 'Creative Content', 'Healthcare', NULL, NULL, 'Healthcare websites, awareness campaigns, AI medical videos, and promotional content.', NULL, NULL, NULL, NULL, NULL, NULL),
('f13', 'featured', 'Dr. Ritesh Gupta Promo', 'AI Videos', 'Healthcare', NULL, NULL, 'Healthcare websites, awareness campaigns, AI medical videos, and promotional content.', NULL, NULL, NULL, NULL, NULL, NULL),
('f14', 'featured', 'Finance Dashboard', 'Website & SEO', 'Finance', NULL, NULL, 'Finance dashboards, investment campaigns, branding creatives, and educational reels.', NULL, NULL, NULL, NULL, NULL, NULL),
('f15', 'featured', 'Investment Campaign', 'Campaigns', 'Finance', NULL, NULL, 'Finance dashboards, investment campaigns, branding creatives, and educational reels.', NULL, NULL, NULL, NULL, NULL, NULL),
('f16', 'featured', 'Finance Social Creative', 'Creative Content', 'Finance', NULL, NULL, 'Finance dashboards, investment campaigns, branding creatives, and educational reels.', NULL, NULL, NULL, NULL, NULL, NULL),
('f17', 'featured', 'Finance Awareness Reel', 'Reels', 'Finance', NULL, NULL, 'Finance dashboards, investment campaigns, branding creatives, and educational reels.', NULL, NULL, NULL, NULL, NULL, NULL),
('f18', 'featured', 'RR Capital Promo', 'AI Videos', 'Finance', NULL, NULL, 'Finance dashboards, investment campaigns, branding creatives, and educational reels.', NULL, NULL, NULL, NULL, NULL, NULL),
('f19', 'featured', 'TaxClair AI Promo', 'AI Videos', 'Finance', NULL, NULL, 'Finance dashboards, investment campaigns, branding creatives, and educational reels.', NULL, NULL, NULL, NULL, NULL, NULL),
('f20', 'featured', 'Hotel Booking Website', 'Website & SEO', 'Hospitality', NULL, NULL, 'Hotel booking platforms, restaurant campaigns, AI hospitality promos, and social media reels.', NULL, NULL, NULL, NULL, NULL, NULL),
('f21', 'featured', 'Restaurant Campaign', 'Campaigns', 'Hospitality', NULL, NULL, 'Hotel booking platforms, restaurant campaigns, AI hospitality promos, and social media reels.', NULL, NULL, NULL, NULL, NULL, NULL),
('f22', 'featured', 'AI Hotel Promo', 'AI Videos', 'Hospitality', NULL, NULL, 'Hotel booking platforms, restaurant campaigns, AI hospitality promos, and social media reels.', NULL, NULL, NULL, NULL, NULL, NULL),
('f23', 'featured', 'Hospitality Reel', 'Reels', 'Hospitality', NULL, NULL, 'Hotel booking platforms, restaurant campaigns, AI hospitality promos, and social media reels.', NULL, NULL, NULL, NULL, NULL, NULL),
('f24', 'featured', 'Solar Landing Page', 'Website & SEO', 'Solar', NULL, NULL, 'Solar websites, green energy campaigns, AI solar videos, and promotional clean energy reels.', NULL, NULL, NULL, NULL, NULL, NULL),
('f25', 'featured', 'Green Energy Campaign', 'Campaigns', 'Solar', NULL, NULL, 'Solar websites, green energy campaigns, AI solar videos, and promotional clean energy reels.', NULL, NULL, NULL, NULL, NULL, NULL),
('f26', 'featured', 'KwikM Solar Promo', 'AI Videos', 'Solar', NULL, NULL, 'Solar websites, green energy campaigns, AI solar videos, and promotional clean energy reels.', NULL, NULL, NULL, NULL, NULL, NULL),
('f27', 'featured', 'Agricultural Landing Page', 'Website & SEO', 'Agriculture', NULL, NULL, 'Agricultural websites, farming campaigns, AI agro videos, and promotional sustainable agriculture reels.', NULL, NULL, NULL, NULL, NULL, NULL),
('f28', 'featured', 'Sustainable Farm Campaign', 'Campaigns', 'Agriculture', NULL, NULL, 'Agricultural websites, farming campaigns, AI agro videos, and promotional sustainable agriculture reels.', NULL, NULL, NULL, NULL, NULL, NULL),
('f29', 'featured', 'Mack Agro Promo', 'AI Videos', 'Agriculture', NULL, NULL, 'Agricultural websites, farming campaigns, AI agro videos, and promotional sustainable agriculture reels.', NULL, NULL, NULL, NULL, NULL, NULL),
('o1', 'other', 'E-commerce Store Development', 'Website & SEO', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('o2', 'other', 'SaaS Platform Launch Campaign', 'Campaigns', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('o3', 'other', 'AI Voice Agent Demo Video', 'AI Videos', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('o4', 'other', 'Corporate Identity Redesign', 'Creative Content', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('o5', 'other', 'Product Launch Promotional Reel', 'Reels', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('o6', 'other', 'Custom Dashboard Integration', 'Website & SEO', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('c1', 'creative', 'Luxury Villa Showcase', NULL, 'Real Estate', NULL, NULL, 'Branding creative for high-end residential real estate listing.', NULL, NULL, NULL, '/creative_content/Creative1.jpeg', 'image', 0),
('c2', 'creative', 'Global University Banner', NULL, 'Real Estate', NULL, NULL, 'Promotional visual for academic programs and admissions.', NULL, NULL, NULL, '/creative_content/Creative3.jpeg', 'image', 2),
('c3', 'creative', 'Online Learning Poster', NULL, 'Real Estate', NULL, NULL, 'E-learning platform advertisement graphic designed for campaigns.', NULL, NULL, NULL, '/creative_content/Creative4.jpeg', 'image', 3),
('c8', 'creative', 'Healthcare Lead Campaign', NULL, 'Healthcare', NULL, NULL, 'Digital marketing campaign designed to help doctors, clinics, and hospitals generate quality leads.', NULL, NULL, NULL, '/creative_content/Creative2.jpeg', 'image', 1),
('c9', 'creative', 'Healthcare Digital Marketing Campaign', NULL, 'Healthcare', NULL, NULL, 'An ad creative and landing page concept designed for B2B lead generation targeting doctors and clinics, highlighting social media marketing, SEO, and paid ad management services.', NULL, NULL, NULL, '/creative_content/Creative5.jpeg', 'image', 4),
('c13', 'creative', 'Investment Growth Ad', NULL, 'Finance', NULL, NULL, 'Wealth management and finance growth promotional content.', NULL, NULL, NULL, '/creative_content/Creative7.jpeg', 'image', 6),
('c14', 'creative', 'Crypto Platform Asset', NULL, 'Finance', NULL, NULL, 'Digital currency trading platform banner design concept.', NULL, NULL, NULL, '/creative_content/Creative8.jpeg', 'image', 7),
('c24', 'creative', 'Restaurant Brand Campaign', NULL, 'Hospitality', NULL, NULL, 'High-quality lead generation and marketing flyer for dining brands.', NULL, NULL, NULL, '/creative_content/Creative6.jpeg', 'image', 5),
('c25', 'creative', 'Gourmet Bistro Banner', NULL, 'Hospitality', NULL, NULL, 'Aesthetic culinary advertising graphic for restaurant promotions.', NULL, NULL, NULL, '/creative_content/Creative9.jpeg', 'image', 8),
('c29', 'creative', 'SaaS Launch Creative', NULL, 'Other Projects', NULL, NULL, 'Software product launch promotional design visual.', NULL, NULL, NULL, '/creative_content/Creative10.jpeg', 'image', 9);

INSERT INTO `portfolio_items` (`id`, `section`, `title`, `category`, `industry`, `metric`, `metric_label`, `description`, `tags`, `accent`, `icon`, `src`, `type`, `global_index`, `thumbnail`) VALUES
('c_anv', 'creative', 'ANV Realty Website', NULL, 'Real Estate', NULL, NULL, 'Premium real estate and preleased properties website showcase. High-performing landing portal with optimized lead acquisition flows.', NULL, NULL, NULL, 'https://anvreealty.com/', 'website', 2, '/uploads/Anv_reality.jpg'),
('f_anv', 'featured', 'ANV Realty Website', 'Website & SEO', 'Real Estate', NULL, NULL, 'Websites, campaigns, AI property promotions, creative branding, and real estate reels.', NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------
-- Table structure for table `blogs`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `blogs`;
CREATE TABLE `blogs` (
  `id` VARCHAR(36) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL,
  `content` LONGTEXT NOT NULL,
  `excerpt` TEXT NOT NULL,
  `cover_image` VARCHAR(255) DEFAULT NULL,
  `category` VARCHAR(100) NOT NULL,
  `published` TINYINT(1) DEFAULT '0',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `blogs`
INSERT INTO `blogs` VALUES 
('b1', 'Welcome to AI Digital Blogs', 'welcome-to-ai-digital-blogs', '## Exploring AI Powered Digital Marketing\n\nWelcome to our blog! We specialize in generating high-performing leads, developing optimized web applications, and building AI videos.\n\n### Why Choose AI Marketing?\n- **Efficiency**: AI algorithms analyze audience insights rapidly.\n- **Conversion**: Dynamically targeted landing pages convert higher.\n- **Speed**: Automating workflow saves precious time.', 'An overview of how AI digital neural tech is transforming digital marketing paradigms.', '/creative_content/Creative1.jpeg', 'Marketing', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- --------------------------------------------------------
-- Table structure for table `whatsapp_logs`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `whatsapp_logs`;
CREATE TABLE `whatsapp_logs` (
  `id` VARCHAR(36) NOT NULL,
  `recipient` VARCHAR(50) NOT NULL,
  `message` TEXT NOT NULL,
  `provider` VARCHAR(50) NOT NULL,
  `status` VARCHAR(20) NOT NULL,
  `error` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `users`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT,
  `name` VARCHAR(100) DEFAULT NULL,
  `email` VARCHAR(150) UNIQUE NOT NULL,
  `google_id` VARCHAR(100) DEFAULT NULL,
  `phone` VARCHAR(20) UNIQUE DEFAULT NULL,
  `phone_verified` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `onboarding_details`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `onboarding_details`;
CREATE TABLE `onboarding_details` (
  `id` VARCHAR(36) NOT NULL,
  `payment_id` VARCHAR(100) NOT NULL,
  `plans` VARCHAR(255) NOT NULL,
  `contact_name` VARCHAR(100) DEFAULT NULL,
  `alt_phone` VARCHAR(50) DEFAULT NULL,
  `business_type` VARCHAR(100) DEFAULT NULL,
  `gstin` VARCHAR(50) DEFAULT NULL,
  `address_line1` TEXT DEFAULT NULL,
  `address_line2` TEXT DEFAULT NULL,
  `city` VARCHAR(100) DEFAULT NULL,
  `state_name` VARCHAR(100) DEFAULT NULL,
  `pin_code` VARCHAR(20) DEFAULT NULL,
  `request_callback` TINYINT(1) DEFAULT '0',
  `scheduled_date` VARCHAR(100) DEFAULT NULL,
  `scheduled_time` VARCHAR(50) DEFAULT NULL,
  `status` VARCHAR(50) DEFAULT 'Pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `checkout_exit_feedback`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `checkout_exit_feedback`;
CREATE TABLE `checkout_exit_feedback` (
  `id` VARCHAR(36) NOT NULL,
  `customer_name` VARCHAR(100) DEFAULT NULL,
  `customer_email` VARCHAR(100) DEFAULT NULL,
  `customer_phone` VARCHAR(50) DEFAULT NULL,
  `plan_name` VARCHAR(100) DEFAULT NULL,
  `plan_price` VARCHAR(50) DEFAULT NULL,
  `reason_exit` VARCHAR(255) DEFAULT NULL,
  `help_reconsider` VARCHAR(255) DEFAULT NULL,
  `wants_contact` VARCHAR(255) DEFAULT NULL,
  `additional_notes` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
