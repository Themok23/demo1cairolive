import { db } from '../db/client';
import { persons, articles, submissions, subscribers } from '../db/schema';
import { sql } from 'drizzle-orm';

async function seed() {
  console.log('Starting seed...');

  try {
    // Clear existing data
    console.log('Clearing existing data...');
    await db.execute(sql`TRUNCATE TABLE articles CASCADE`);
    await db.execute(sql`TRUNCATE TABLE persons CASCADE`);
    await db.execute(sql`TRUNCATE TABLE submissions CASCADE`);
    await db.execute(sql`TRUNCATE TABLE subscribers CASCADE`);

    const now = new Date();

    // Use slug-friendly IDs
    const ahmedId = 'ahmed-essam';
    const nourhranId = 'nourhan-el-sherif';
    const karimId = 'karim-abdel-aziz';
    const mariamId = 'mariam-hassan';

    await db.insert(persons).values([
      {
        id: ahmedId,
        firstName: 'Ahmed',
        lastName: 'Essam',
        email: 'ahmed.essam@example.com',
        phoneNumber: '+201001234567',
        dateOfBirth: new Date('1994-05-15') as any,
        gender: 'male',
        bio: 'Ahmed is a Cairo-born engineer who went from building side projects in his university dorm to shipping products used by millions. Known for his deep expertise in distributed systems and his passion for mentoring junior Egyptian developers.',
        profileImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500',
        coverImageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200',
        currentPosition: 'Senior Software Engineer',
        currentCompany: 'Microsoft Egypt',
        location: 'Cairo, Egypt',
        tier: 'gold',
        isVerified: true,
        isClaimed: false,
        keywords: JSON.stringify([
          'distributed-systems',
          'backend-engineering',
          'mentorship',
          'egyptian-tech',
        ]),
        linkedinUrl: 'https://linkedin.com/in/ahmadessam',
        twitterUrl: 'https://twitter.com/ahmadessam',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: nourhranId,
        firstName: 'Nourhan',
        lastName: 'El-Sherif',
        email: 'nourhan.elsherif@example.com',
        phoneNumber: '+201001234568',
        dateOfBirth: new Date('1996-08-22') as any,
        gender: 'female',
        bio: 'Nourhan bridges the gap between technology and business strategy. She led the redesign of Vodafone Egypt\'s self-service app, increasing user engagement by 40%. A vocal advocate for women in Egyptian tech.',
        profileImageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500',
        coverImageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200',
        currentPosition: 'Senior Product Manager',
        currentCompany: 'Vodafone Egypt',
        location: 'Cairo, Egypt',
        tier: 'gold',
        isVerified: true,
        isClaimed: false,
        keywords: JSON.stringify([
          'product-management',
          'user-experience',
          'women-in-tech',
          'mobile-apps',
        ]),
        linkedinUrl: 'https://linkedin.com/in/nourhansherif',
        twitterUrl: 'https://twitter.com/nourhansherif',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: karimId,
        firstName: 'Karim',
        lastName: 'Abdel-Aziz',
        email: 'karim.abdelaziz@example.com',
        phoneNumber: '+201001234569',
        dateOfBirth: new Date('1992-03-10') as any,
        gender: 'male',
        bio: 'Karim\'s campaigns have won regional and international recognition. His "Egypt\'s Streets" campaign for a local NGO went viral and was featured in Communication Arts. He believes Egyptian creativity is underrepresented on the global stage.',
        profileImageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500',
        coverImageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200',
        currentPosition: 'Executive Creative Director',
        currentCompany: 'Leo Burnett Cairo',
        location: 'Cairo, Egypt',
        tier: 'silver',
        isVerified: true,
        isClaimed: false,
        keywords: JSON.stringify([
          'creative-direction',
          'advertising',
          'campaigns',
          'egyptian-art',
        ]),
        linkedinUrl: 'https://linkedin.com/in/karimabdelaziz',
        instagramUrl: 'https://instagram.com/karimabdelaziz',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: mariamId,
        firstName: 'Mariam',
        lastName: 'Hassan',
        email: 'mariam.hassan@example.com',
        phoneNumber: '+201001234570',
        dateOfBirth: new Date('1998-11-30') as any,
        gender: 'female',
        bio: 'Mariam is one of Egypt\'s rising stars in AI research. Her PhD thesis on Arabic NLP models has been cited over 200 times. She runs a free weekend workshop teaching data science to Egyptian university students.',
        profileImageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500',
        coverImageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200',
        currentPosition: 'Lead Data Scientist',
        currentCompany: 'IBM Egypt',
        location: 'Cairo, Egypt',
        tier: 'platinum',
        isVerified: true,
        isClaimed: false,
        keywords: JSON.stringify([
          'ai-research',
          'natural-language-processing',
          'machine-learning',
          'data-science',
        ]),
        linkedinUrl: 'https://linkedin.com/in/mariamhassan',
        twitterUrl: 'https://twitter.com/mariamhassan',
        createdAt: now,
        updatedAt: now,
      },
    ]);

    console.log('Created 4 people profiles');

    const article1Content = `In the rapidly evolving landscape of distributed systems and product innovation, Egyptian professionals are making unprecedented global impact. Ahmed Essam, a Senior Software Engineer at Microsoft Egypt, and Nourhan El-Sherif, Senior Product Manager at Vodafone Egypt, represent the new generation of leaders reshaping how technology is built and delivered across the region.

Ahmed's journey began at Cairo University where he obtained his BSc in Computer Engineering in 2017. During his university years, he worked on side projects that eventually led to internships at Valeo in 2017, followed by a significant stint at Google from 2019 to 2022, where he worked on scalability challenges that impacted millions of users.

"When I started my career, the opportunities seemed limited," Ahmed reflects. "But the key was to build products that matter, solve real problems, and share knowledge with the community. Google taught me the importance of system design at scale, but it also made me realize that the best problems are being solved back home in Egypt."

Today, at Microsoft Egypt, Ahmed focuses on building resilient distributed systems while mentoring the next generation of Egyptian developers. He holds AWS Solutions Architect certification (2021) and Google Cloud Professional certification (2023), making him one of Egypt's most credentialed backend engineers.

Meanwhile, Nourhan approached the same challenge from a product perspective. As Senior Product Manager at Vodafone Egypt, she led a comprehensive redesign of the company's mobile app that resulted in a 40% increase in user engagement. With an MBA from ESLSCA (2020) and certifications in Project Management (PMP, 2019) and Scrum Product Ownership (CSPO, 2021), Nourhan combines technical knowledge with business acumen.

"Product management is about understanding human behavior and solving real problems," she explains. "The gap between product and creativity is where the magic happens. When you understand what users need and can articulate it creatively, you build products people love."

Both emphasize the importance of mentorship and knowledge transfer. "The future of Egyptian tech depends on knowledge transfer," Ahmed notes. "Every junior developer we mentor is a potential game-changer for our industry." Nourhan echoes this sentiment: "We're not just building our own careers. We're opening doors for the next generation of Egyptian innovators."`;

    const article2Content = `Cairo's skyline is changing, and so is the conversation about who gets to shape it. Karim Abdel-Aziz, Executive Creative Director at Leo Burnett Cairo, and Mariam Hassan, Lead Data Scientist at IBM Egypt, represent an unlikely but powerful pairing: creativity meeting artificial intelligence.

Karim's work has garnered regional and international recognition. His award-winning "Egypt's Streets" campaign for a local NGO didn't just go viral; it sparked international conversations about social responsibility in advertising. When he won the Cannes Lions Young Creative Award in 2019, it wasn't just a personal victory. "It was validation that Egyptian creativity could compete at the highest level," Karim explains.

Karim believes deeply that Egyptian storytelling has universal appeal. "Our culture, our history, our perspective - these are assets that the global market needs. The issue isn't the quality of Egyptian talent. It's the visibility. We need platforms to amplify our voices."

On the other side of this conversation is Mariam Hassan, one of Egypt's rising stars in AI research. Her PhD thesis on Arabic Natural Language Processing models has been cited over 200 times in academic circles. More impressively, she runs a free weekend workshop teaching data science to Egyptian university students, believing that AI literacy is a public good.

"Technology should serve human stories, not replace them," Mariam notes. "When Karim talks about Egyptian creativity needing amplification, I think about how AI can help scale that message globally. Imagine using machine learning to translate, contextualize, and personalize Egyptian stories for audiences worldwide."

The intersection of their work represents something bigger: a recognition that Egypt's competitive advantage isn't just in engineering or creativity separately, but in the fusion of both. Technology without culture is sterile. Culture without technology struggles to reach its audience.

Both professionals are committed to mentorship and community building. "We're creating the infrastructure for the next generation to do even better," Karim says. Mariam adds, "If we can demonstrate that Egypt produces world-class talent in every domain, from creative direction to AI research, we change the global narrative about what Egypt is capable of."`;

    const article3Content = `The story of Egyptian innovation isn't written in one discipline. It's written where multiple talents intersect, challenge each other, and ultimately create something neither could alone. Ahmed Essam, Senior Software Engineer at Microsoft Egypt, and Mariam Hassan, Lead Data Scientist at IBM Egypt, embody this principle.

Ahmed's architecture builds the systems that handle millions of transactions daily. Mariam's models ensure those systems can learn, adapt, and predict user behavior with increasing accuracy. Together, they represent the full stack of modern software excellence.

Ahmed came to distributed systems through persistence. Starting with side projects as a university student, he built increasingly complex systems until Google took notice. After three years at Google working on infrastructure at massive scale, he understood something profound: "Systems are built by people, and people learn best from mentors. That's why I came back to Egypt. The infrastructure challenges here are just as complex as Silicon Valley, and the human element is even more important."

His philosophy shaped his approach at Microsoft Egypt: hire talented Egyptians, give them hard problems, and invest in their growth. His team has grown from three engineers to fifteen in two years.

Mariam's path was more traditional but equally determined. Her academic credentials are impressive, but what distinguishes her is her commitment to democratizing data science. "In Silicon Valley, AI is often positioned as magic. It's not. It's statistics, mathematics, and computation. Every Egyptian engineer should understand it. Every Egyptian business should leverage it."

The collaboration between Ahmed and Mariam happens at the intersection of backend architecture and machine learning optimization. Ahmed builds systems efficient enough to run Mariam's models in production. Mariam builds models that make Ahmed's systems smarter.

"When engineering meets data science," Ahmed explains, "you get systems that not only work at scale but adapt at scale. A banking system that learns fraudulent patterns in real time. A telecommunications platform that predicts customer needs before they're articulated. That's the future, and it's being built right here in Cairo."

Mariam adds a final thought about why this matters: "Egypt has always been a place where knowledge is preserved and passed forward. The pyramid builders understood mathematics and engineering. The Library of Alexandria brought together the world's knowledge. Today's equivalent is building AI systems that can learn from our problems and teach other systems globally about Egyptian innovation. That's legacy work."`;

    const article4Content = `In the world of advertising and product strategy, few pairings have proven as generatively powerful as creativity and strategic thinking. Karim Abdel-Aziz, Executive Creative Director at Leo Burnett Cairo, and Nourhan El-Sherif, Senior Product Manager at Vodafone Egypt, represent the new face of Egyptian marketing leadership.

Karim came to advertising through a non-traditional route. His undergraduate degree was in fine arts, but his appetite for impact pulled him toward commercial storytelling. "Art for art's sake is beautiful," he explains. "But art that changes behavior, that influences decisions, that impacts business and society? That's a different kind of power."

His "Egypt's Streets" campaign demonstrated this perfectly. Partnering with a local NGO, Karim crafted a narrative that went far beyond awareness. It changed perceptions, drove donations, and created a cultural moment. The campaign's success at Cannes Lions wasn't surprising to those who understood his methodology: deep research into human psychology, cultural insight, and relentless creative iteration.

Nourhan approaches the same challenges from the product angle. As Senior Product Manager at Vodafone Egypt, she leads a team that makes daily decisions affecting millions of users. Her redesign of Vodafone's mobile app increased engagement by 40%, a metric that translates directly to revenue and customer satisfaction.

"Product strategy is storytelling with data," Nourhan says. "Every feature we ship, every interface element we redesign, tells users something about what we believe they need and want. The best products are those where creativity and strategy are in constant dialogue."

When creativity and product strategy align, remarkable things happen. User experience becomes intuitive. Marketing becomes authentic. Growth becomes sustainable.

Both Karim and Nourhan place enormous emphasis on understanding the Egyptian market specifically. "Global best practices are a starting point," Karim notes. "But Egypt's context is unique. Our humor is different. Our values are different. Our aspirations are different. A campaign that works in New York might fall flat in Cairo. Understanding local nuance isn't a limitation; it's an unfair advantage."

Nourhan echoes this: "We run countless A/B tests, but the most important test is cultural fit. Does this resonate? Does it feel authentic? Does it feel Egyptian? When the data aligns with cultural authenticity, that's when products succeed."

Looking forward, both see enormous opportunity. "We're at an inflection point," Karim believes. "Egypt is finally getting the global attention it deserves. The question is: what stories will we tell? Who will tell them? And will we own our narrative, or let others define us?"

Nourhan's perspective is similarly optimistic: "Technology is becoming the primary interface through which people experience brands, culture, and commerce. If we can build that technology with cultural intelligence, we're not just succeeding commercially. We're shaping how the world understands Egypt."`;

    await db.insert(articles).values([
      {
        id: 'article-two-egyptians-tech',
        title: 'Two Egyptians Shaping the Tech Scene',
        slug: 'two-egyptians-shaping-tech-scene',
        content: article1Content,
        excerpt: 'Ahmed Essam and Nourhan El-Sherif discuss how engineering and product strategy are transforming Egyptian technology.',
        authorId: ahmedId,
        authorName: 'Ahmed Essam',
        featuredImageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1000',
        status: 'published',
        publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        tags: JSON.stringify(['technology', 'product-management', 'engineering', 'egypt']),
        category: 'Technology',
        readTimeMinutes: 8,
        viewCount: 145,
        malePersonId: ahmedId,
        femalePersonId: nourhranId,
      },
      {
        id: 'article-cairo-world-stage',
        title: 'From Cairo to the World Stage',
        slug: 'from-cairo-to-world-stage',
        content: article2Content,
        excerpt: 'Karim Abdel-Aziz and Mariam Hassan demonstrate how creativity and AI are reshaping global narratives about Egypt.',
        authorId: karimId,
        authorName: 'Karim Abdel-Aziz',
        featuredImageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1000',
        status: 'published',
        publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        tags: JSON.stringify(['creativity', 'ai', 'innovation', 'global']),
        category: 'Innovation',
        readTimeMinutes: 9,
        viewCount: 203,
        malePersonId: karimId,
        femalePersonId: mariamId,
      },
      {
        id: 'article-engineering-meets-data',
        title: 'When Engineering Meets Data Science',
        slug: 'when-engineering-meets-data-science',
        content: article3Content,
        excerpt: 'Ahmed Essam and Mariam Hassan explore the intersection of backend architecture and machine learning in Cairo.',
        authorId: ahmedId,
        authorName: 'Ahmed Essam',
        featuredImageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1000',
        status: 'published',
        publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        tags: JSON.stringify(['engineering', 'ai', 'machine-learning', 'backend']),
        category: 'Technology',
        readTimeMinutes: 8,
        viewCount: 167,
        malePersonId: ahmedId,
        femalePersonId: mariamId,
      },
      {
        id: 'article-creativity-strategy',
        title: 'Creativity and Product Strategy Collide',
        slug: 'creativity-product-strategy-collide',
        content: article4Content,
        excerpt: 'Karim Abdel-Aziz and Nourhan El-Sherif discuss building products and campaigns that resonate culturally.',
        authorId: karimId,
        authorName: 'Karim Abdel-Aziz',
        featuredImageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1000',
        status: 'published',
        publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        tags: JSON.stringify(['marketing', 'product', 'strategy', 'creativity']),
        category: 'Business',
        readTimeMinutes: 9,
        viewCount: 189,
        malePersonId: karimId,
        femalePersonId: nourhranId,
      },
    ]);

    console.log('Created 4 published articles with male and female person links');

    const submissionId = `submission-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    await db.insert(submissions).values([
      {
        id: submissionId,
        firstName: 'Fatima',
        lastName: 'Al-Mansouri',
        email: 'fatima.almansouri@example.com',
        phoneNumber: '+201001234571',
        dateOfBirth: new Date('2000-02-14') as any,
        gender: 'female',
        bio: 'Software developer passionate about web technologies and open source contributions.',
        profileImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500',
        currentPosition: 'Junior Web Developer',
        currentCompany: 'Tech Startup Cairo',
        location: 'Alexandria, Egypt',
        keywords: JSON.stringify(['web-development', 'react', 'open-source']),
        linkedinUrl: 'https://linkedin.com/in/fatimaalmansouri',
        status: 'pending',
        submittedBy: 'self',
        submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) as any,
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) as any,
      },
    ]);

    console.log('Created 1 pending submission');

    await db.insert(subscribers).values([
      {
        id: `subscriber-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        email: 'subscriber1@example.com',
        firstName: 'Mohamed',
        lastName: 'Khaled',
        isActive: true,
        subscribedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
      {
        id: `subscriber-${Date.now() + 1}-${Math.random().toString(36).substr(2, 9)}`,
        email: 'subscriber2@example.com',
        firstName: 'Amira',
        lastName: 'Said',
        isActive: true,
        subscribedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      },
    ]);

    console.log('Created 2 active subscribers');
    console.log('Seed completed successfully!');
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
}

seed();
