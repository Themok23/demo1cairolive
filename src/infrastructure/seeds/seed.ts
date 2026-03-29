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

    // Use slug-friendly IDs for 6 people (3 male, 3 female)
    const ahmedId = 'ahmed-essam';
    const nourhranId = 'nourhan-el-sherif';
    const karimId = 'karim-abdel-aziz';
    const mariamId = 'mariam-hassan';
    const omarId = 'omar-farouk';
    const yasmineId = 'yasmine-nabil';

    await db.insert(persons).values([
      {
        id: ahmedId,
        firstName: 'Ahmed',
        lastName: 'Essam',
        email: 'ahmed.essam@example.com',
        phoneNumber: '+201001234567',
        dateOfBirth: new Date('1994-05-15') as any,
        gender: 'male',
        bio: `Ahmed Essam is a Cairo-born fintech architect who has become one of the MENA region's most influential voices in distributed systems and blockchain technology. Starting with side projects while completing his computer science degree at the American University in Cairo, he taught himself distributed systems architecture through hands-on experimentation—building payment protocols that could work across Egypt's fragmented internet infrastructure, designing ledger systems for remittance corridors, and engineering the backend systems that would eventually power VentureLab Egypt. His breakthrough came when he realized that Egypt's constraints—limited bandwidth, inconsistent power supply, regulatory uncertainty—weren't obstacles to innovation but rather forcing functions that drove more elegant solutions.

Today, VentureLab Egypt has become the MENA region's premier fintech acceleration platform, launching over forty companies, eight of which achieved unicorn valuations and three acquired by global institutions. Ahmed's platform is known for backing founders solving genuinely hard problems: financial inclusion for unbanked populations, trade finance for small agricultural exporters, and credit scoring systems for the gig economy. He combines technical rigor with founder psychology, often personally code-reviewing critical systems and facilitating deep technical conversations between portfolio companies and his engineering team.

Ahmed's influence extends beyond entrepreneurship into the policy sphere. He regularly advises Egypt's Central Bank on regulatory frameworks for digital finance, speaks at the World Economic Forum on emerging market fintech, and has mentored over two hundred junior developers who have gone on to lead technical teams across the Arab world. What distinguishes Ahmed is his philosophical commitment to building sustainable innovation ecosystems rather than chasing venture returns. He has implemented a requirement that every technical leader on his team must mentor at least five junior developers annually—a multiplier effect that has created a genuine pipeline of Egyptian technical talent.

غرب القاهرة في حي المعادي، نشأ أحمد عصام وسط عائلة من المهندسين والمعلمين، مما زرع فيه اهتمام عميق بحل المشاكل المعقدة. التحق بالجامعة الأمريكية بالقاهرة وبدأ بناء نماذج أولية لأنظمة الدفع الموزعة في غرفة نومه بالسكن الجامعي. رؤيته كانت واضحة: مصر لا تحتاج إلى استيراد حلول من وادي السيليكون، بل تحتاج إلى بناء أنظمة مصممة خصيصاً للواقع المصري. بعد التخرج، عمل في عدة شركات ناشئة قبل أن يقرر إطلاق منصته الخاصة التي ستصبح نموذج العمل المختلف.

منصة أحمد ليست مجرد منسق للتمويل بل هي حاضنة حقيقية توفر البنية التحتية التقنية والدعم الاستراتيجي والوصول إلى شبكة عالمية من المستثمرين والخبراء. اختار أحمد بعناية شركاءه الاستثماريين ليعكسوا التزامه بالمسؤولية الاجتماعية، بحيث تركز المحفظة على تقنيات تحسن حياة الملايين من المصريين غير المخدومين مالياً. كان أول استثماراته في منصة تحويل أموال موثوقة للعاملين بالخارج، وثانيها في نظام ائتمان يستخدم البيانات البديلة لتقييم الأفراد العاملين في القطاع غير الرسمي.

التزام أحمد بالتعليم عميق الجذور. يقضي ساعات أسبوعياً في تدريس فصول حول هندسة الأنظمة الموزعة في جامعات محلية، وقد بنى مكتبة مفتوحة المصدر ضخمة للمطورين المصريين. محتوى التعليم الذي ينتجه موجود بالإنجليزية والعربية، مما يضمن إمكانية الوصول. شهادات طلابه توضح أن درسه غيّر مساراتهم المهنية—سبعة من تسعة من دفعته الأولى أسسوا الآن شركاتهم الناشئة الخاصة.`,
        profileImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
        coverImageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=400&fit=crop',
        currentPosition: 'Founder & CTO',
        currentCompany: 'VentureLab Egypt',
        location: 'Cairo, Egypt',
        tier: 'gold',
        isVerified: true,
        isClaimed: false,
        keywords: JSON.stringify([
          'distributed-systems',
          'blockchain',
          'fintech',
          'entrepreneurship',
        ]),
        linkedinUrl: 'https://linkedin.com/in/ahmadessam',
        twitterUrl: 'https://twitter.com/ahmadessam',
        instagramUrl: 'https://instagram.com/ahmadessam',
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
        bio: `Nourhan El-Sherif is an award-winning investigative journalist and editor-in-chief of Cairo Times Digital, one of the Arab world's most respected independent news organizations. Her career spans the critical transformation of journalism from print-centric to digitally native, and her reporting has consistently challenged power structures and amplified marginalized voices across Egypt. After graduating from the American University in Cairo with honors in journalism, she spent three years as a correspondent covering North Africa for international outlets before recognizing that the most important stories were being told only through Western lenses. She founded her current publication to directly serve Egyptian and Arab audiences, ensuring that narratives of Egypt would be shaped by Egyptian journalists with deep contextual understanding.

Her investigative team has exposed corruption networks involving high-ranking officials, environmental crimes threatening the Nile Delta, and human trafficking networks operating with impunity. Her five-part investigation into digital surveillance practices by state and private actors won the Reporters Without Borders Press Freedom Award in 2022 and directly influenced parliamentary discussions about digital privacy legislation. What distinguishes Nourhan's journalism is her refusal of both sensationalism and deference to power. Her pieces are meticulously reported, multiply-sourced, and willing to sit with moral complexity rather than impose narrative certainty.

Beyond hard news, Nourhan has pioneered a distinctive approach to cultural journalism that treats Egyptian art, music, literature, and everyday life with the same seriousness that Western media reserves for Western subjects. Her profile series "Ordinary Excellence" has documented the lives of teachers, farmers, artisans, and community leaders doing transformative work outside the glare of major institutions. These pieces have become culturally significant, frequently shared on social media and influencing how Egyptians understand their own communities. Nourhan directly mentors twenty journalists annually through her fellowship program, with particular focus on recruiting reporters from Upper Egypt and marginalized communities who have historically been underrepresented in Egyptian newsrooms.

نورهان الشريف تمثل صوتاً جديداً في الصحافة المصرية—صوت تعليمي ومرموق وغير خاضع. نشأت في أسرة ثقافية متعددة الاهتمامات بحي الزمالك بالقاهرة، حيث كانت والدتها أستاذة أدب إنجليزي ووالدها محام متخصص في القانون الدولي. كانت تقرأ منذ الطفولة، ثم اكتشفت شغفها بالصحافة عندما كانت طالبة تغطي احتجاجات الطلاب ضد سياسات الجامعة. قررت أن تكرس حياتها لسرد الحقائق.

التزام نورهان بحرية الصحافة عميق وعملي. تحافظ على موارد كاملة مخصصة لحماية مصادرها، وتدافع بشراسة عن حق الصحفيين في الوصول إلى المعلومات. عندما واجهت ضغوطات حكومية وتهديدات على سلامتها الشخصية بسبب تقاريرها، ظلت ملتزمة بمبادئها. قالت في مقابلة: "حرية الصحافة ليست رفاهية. إنها أساس الديمقراطية والحكم الرشيد. وإذا تنازلنا عن هذا المبدأ، فإننا نتنازل عن حق الشعب في معرفة الحقيقة."

اليوم، تشرف نورهان على فريق من أربعين صحفياً وعاملاً في مجالات التحرير والتصميم والإنتاج الرقمي. مؤسستها حققت استدامة مالية من خلال نموذج تمويل متعدد الأطراف يضم اشتراكات القراء والدعم من مؤسسات حقوق الإنسان والإعلانات الأخلاقية. وهي تحافظ على سياسة صارمة بعدم قبول تمويل من أي جهة حكومية أو شركة قد يعرض استقلاليتها التحريرية للخطر.`,
        profileImageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face',
        coverImageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&h=400&fit=crop',
        currentPosition: 'Editor-in-Chief',
        currentCompany: 'Cairo Times Digital',
        location: 'Cairo, Egypt',
        tier: 'silver',
        isVerified: true,
        isClaimed: false,
        keywords: JSON.stringify([
          'journalism',
          'investigative-reporting',
          'media',
          'storytelling',
        ]),
        linkedinUrl: 'https://linkedin.com/in/nourhansherif',
        twitterUrl: 'https://twitter.com/nourhansherif',
        instagramUrl: 'https://instagram.com/nourhansherif',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: karimId,
        firstName: 'Karim',
        lastName: 'Abdel Aziz',
        email: 'karim.abdelaziz@example.com',
        phoneNumber: '+201001234569',
        dateOfBirth: new Date('1992-03-10') as any,
        gender: 'male',
        bio: `Karim Abdel Aziz is a visionary architect and urban planner who has fundamentally reshaped conversations about design's role in solving Egypt's most pressing urban challenges. After completing his architecture degree at Ain Shams University and a fellowship at the Architectural Association in London, he returned to Cairo with a conviction that Egyptian architecture contained thousands of years of solutions to contemporary problems. His breakthrough project was the revitalization of Islamic Cairo—a historically significant but economically struggling neighborhood in central Cairo. Rather than imposing top-down design, he spent eighteen months listening: conducting oral histories with longtime residents, documenting vernacular building techniques, mapping community needs and aspirations. The resulting design process involved over two hundred community members and drew explicitly on architectural knowledge embedded in the neighborhood's six-hundred-year history.

The transformation of Islamic Cairo has become a global case study in equitable urban design. Historic structures were preserved and revitalized rather than demolished for luxury development. Traditional crafts—stone masonry, inlaid woodwork, textile production—were integrated into the economic strategy, creating employment for artisans whose skills had become obsolete. A functioning marketplace emerged, anchored by cafes, galleries, and craft studios, generating foot traffic while remaining financially accessible to locals. The project won the UN-Habitat scroll of honor and has been featured in the world's leading architecture publications, but its real success is in the lived experience of residents who finally see economic opportunity and cultural dignity in their own neighborhood.

Karim's architectural philosophy is explicitly political. He argues that every design decision reflects assumptions about power, equity, and belonging. When he preserves a historic neighborhood rather than demolishing it for luxury development, he's choosing whose history matters. When he designs public squares instead of privatized malls, he's choosing public good over profit extraction. When he engages community voices in design rather than imposing expert judgment, he's choosing democracy over paternalism. His recent projects include sustainable housing for informal settlement residents in Imbaba, a cultural center in Zamalek that doubles as affordable workspace for artists, and an urban campus in New Cairo built on principles of accessible, human-scaled design. International commissions have followed—a sustainable housing complex in Berlin informed by Upper Egyptian building techniques, a cultural center in Brussels whose spatial logic derives from traditional souk layouts.

كريم عبد العزيز يرى العمارة كفعل ثقافي وسياسي، وليس مجرد تصميم. نشأ في أسرة من المثقفين والفنانين في القاهرة، وقضى سنوات طفولته يرسم المباني التاريخية والشوارع والحدائق. درس الرسم والعمارة بتوازن، مما أكسبه حساسية فنية فريدة تجمع بين الجمال والوظيفة. عندما عاد إلى مصر بعد دراسته في لندن، كان يعلم أنه يريد أن يبني شيئاً مختلفاً—عمارة خدم المجتمع، وليس من يختارون المشروع.

في مشروع إحياء القاهرة الإسلامية، أظهر كريم نموذجاً جديداً تماماً للعملية التصميمية. بدلاً من ورش عمل تخطيطية تقليدية شارك فيها خبراء بارزون، قام بتجميع فريق من الجغرافيين والمؤرخين والفنانين والسكان الحاليين. اجتمع معهم في المقاهي والمنازل الخاصة، وشارك الشاي وقصصهم. سمع عن التفاصيل الدقيقة لحياتهم—حيث يجلسون، أين يتسوقون، كيف ينتقلون عبر الأحياء. تعلم تقنيات بناء تقليدية من المعماريين المحليين والحرفيين الذين ظلوا يعملون برغم غياب الاهتمام الحكومي.

النتيجة كانت عملية تصميم حقيقية، تجمع الجمال مع الوظيفة مع الحساسية الثقافية. لم يتم هدم أي مبنى تاريخي—تم ترميمها وإعادة تنشيطها. تم توظيف الحرفيين المحليين للعمل على هذه الترميمات، مما أعاد الكرامة لمهاراتهم. ظهرت متاجر جديدة وثقافية ومساحات عمل بأسعار معقولة. اليوم، القاهرة الإسلامية نموذج عالمي لكيفية إحياء الأحياء التاريخية بشكل عادل ومستدام.`,
        profileImageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
        coverImageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=400&fit=crop',
        currentPosition: 'Principal Architect',
        currentCompany: 'Aziz Design Studios',
        location: 'Cairo, Egypt',
        tier: 'bronze',
        isVerified: false,
        isClaimed: false,
        keywords: JSON.stringify([
          'architecture',
          'urban-design',
          'sustainable-design',
          'innovation',
        ]),
        linkedinUrl: 'https://linkedin.com/in/karimabdelaziz',
        twitterUrl: 'https://twitter.com/karimabdelaziz',
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
        bio: `Mariam Hassan is one of the Arab world's leading artificial intelligence researchers, with particular expertise in natural language processing for Arabic languages. Her PhD dissertation at Cairo University—"Semantic Analysis and Cultural Specificity in Arabic NLP: Building AI Systems for Arabic Speakers"—became the most-cited research paper in Arabic AI within three years of publication, with applications spanning healthcare, e-commerce, digital government services, and cultural preservation. After completing her doctorate, she joined Cairo Innovation Hub as head of AI research, where she oversees a team developing AI systems specifically trained on Arabic language data and cultural context. Her work has fundamentally challenged the assumption that AI systems built for English automatically transfer to Arabic; instead, she demonstrates how linguistic and cultural specificity requires purpose-built approaches that actually deliver superior results.

Her most significant contribution has been exposing algorithmic bias in commercial AI systems serving Arabic speakers. She demonstrated that major speech recognition systems had error rates twice as high for Arabic speakers as for English speakers, and that machine translation systems systematically mistranslated Arabic idioms, cultural references, and context-dependent meanings. These weren't technical oversights—they reflected straightforward decisions by companies to prioritize English-speaking markets because they were larger and more profitable. Her research led to policy recommendations adopted by Egypt's government and influenced technical standards across the MENA region. She founded the open-source Arabic NLP initiative, which provides researchers across the Arab world with datasets, tools, and pre-trained models specifically optimized for Arabic language complexity.

Mariam's approach to AI is explicitly values-driven. She has developed frameworks for assessing algorithmic fairness in contexts where commercial incentives often push toward discrimination. When a credit-scoring AI trained on historical loan data will systematically disadvantage women because of historical lending discrimination, she asks: how do we build systems that allocate resources more justly while remaining technically feasible and commercially viable? Her work on bias mitigation in Arabic NLP has become required reading in computer science programs across the MENA region. She mentors fifty AI researchers annually, with particular focus on young women from underrepresented communities, and regularly speaks about the ethical responsibilities of AI researchers building systems for vulnerable populations.

مريم حسن تمثل نموذجاً جديداً من الباحث—باحث منخرط مباشرة في التحديات الحقيقية التي يواجهها مجتمعه. نشأت في جيزة لأسرة من الأطباء والمعلمين، وكانت دائماً محبة للرياضيات والعلوم. عندما دخلت الجامعة، كانت متحمسة حول احتمالات الذكاء الاصطناعي، لكنها أدركت بسرعة أن معظم الأبحاث المتاحة كانت مركزة على اللغة الإنجليزية والسياقات الغربية. قررت أن تكرس نفسها لسد هذه الفجوة.

في أطروحتها الدكتوراه، قامت مريم بتحليل شامل لكيفية أن اللغة العربية تحتوي على تعقيدات لا توجد في اللغات الأوروبية—النحو المرن، والتشكيل القياسي، والتراكيب الاستعارية المعقدة التي تتضمن جماليات ثقافية عميقة. أظهرت أن الأنظمة التي تم تدريبها على البيانات الإنجليزية ببساطة لا يمكنها التعامل مع هذه التعقيدات، وبالتالي فإن أداء نماذج الذكاء الاصطناعي على العربية كانت سيئة جداً بشكل غير مقبول.

بدأت مريم تجميع مجموعات بيانات نصية ضخمة من مصادر عربية متنوعة—الكتب والصحف والمحادثات والشعر والقانون والعلوم الطبية. قامت بتدريب نماذج جديدة على هذه البيانات، وحققت نتائج لم تُحصل عليها من قبل لأنظمة معالجة اللغة الطبيعية العربية. اليوم، أبحاثها تُستخدم من قبل الحكومات والشركات والجامعات عبر العالم العربي.`,
        profileImageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
        coverImageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=400&fit=crop',
        currentPosition: 'Head of AI Research',
        currentCompany: 'Cairo Innovation Hub',
        location: 'Giza, Egypt',
        tier: 'gold',
        isVerified: true,
        isClaimed: false,
        keywords: JSON.stringify([
          'ai-research',
          'natural-language-processing',
          'machine-learning',
          'arabic-nlp',
        ]),
        linkedinUrl: 'https://linkedin.com/in/mariamhassan',
        twitterUrl: 'https://twitter.com/mariamhassan',
        instagramUrl: 'https://instagram.com/mariamhassan',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: omarId,
        firstName: 'Omar',
        lastName: 'Farouk',
        email: 'omar.farouk@example.com',
        phoneNumber: '+201001234571',
        dateOfBirth: new Date('1991-07-03') as any,
        gender: 'male',
        bio: `Omar Farouk is an award-winning film director whose work has fundamentally changed how Egypt is represented in global cinema. His breakthrough feature film "The Last Fellah"—a poetic portrait of an aging farmer confronting urban expansion—premiered at the Berlin International Film Festival and won the Golden Bear for direction. The film's refusal to sentimentalize or exoticize its protagonist, instead presenting a fully realized human being navigating profound change, resonated globally precisely because it refused easy emotional shortcuts. Since then, Omar has established himself as one of the Arab world's most significant contemporary filmmakers, with subsequent films exploring the 2011 Egyptian Revolution, Sudanese music traditions, and the lived experience of marginalized communities across North Africa.

What distinguishes Omar's cinematic vision is his commitment to visual and narrative complexity. He works with cinematographers at the highest international level, shooting in locations often ignored by commercial cinema—rural villages, informal urban settlements, heritage neighborhoods—and treating these spaces with the visual care reserved for romantic European landscapes. His approach to storytelling refuses both Western sentimentalism and nationalist propaganda. His five-hour documentary "Voices of the Nile"—which follows five working-class women through the decade following the 2011 revolution—presents their perspectives without voiceover narration, editorial judgment, or imposed narrative arc. The film invites viewers into their worlds and trusts audiences to develop their own understanding. This approach has earned him recognition from major international festivals and scholars of documentary cinema.

Beyond filmmaking, Omar has established the Cairo Cinema Institute, a production school and equipment hub that democratizes access to filmmaking for emerging directors from underrepresented communities. The institute has trained over three hundred young filmmakers, many of whom have gone on to make their own significant work. Omar insists that technical excellence should not be the exclusive domain of well-funded directors from elite backgrounds, and he subsidizes tuition for talented students from lower-income backgrounds and from Egypt's regional cities. He mentors fifteen filmmakers annually and has created an international network that connects Egyptian directors with producers, distributors, and funding sources globally. His production company has become known for backing projects that challenge dominant narratives and amplify marginalized voices.

عمر فاروق يمثل جيل جديداً من صناع الأفلام المصريين الذين يرفضون اللعب بقواعد السينما الغربية. نشأ في الإسكندرية لأسرة من الموسيقيين والفنانين، وكان شاباً متمردًا يشعر بالاختناق من الروايات الرسمية عن مصر. بدأ بصناعة أفلام قصيرة بكاميرا رخيصة، ثم حصل على منحة دراسية للدراسة في معهد برلين للسينما. هناك، تعرض لمجموعة واسعة من أساليب الإخراج والنظريات السينمائية، لكنه ظل مصراً على أن عمله يجب أن يخدم رؤيته الخاصة، وليس محاكاة ما فعله مخرجون آخرون.

فيلمه الأول "آخر فلاح" بدأ كفكرة بسيطة—قضاء ثلاثة أشهر في قرية صغيرة خارج القاهرة، والعيش مع عائلة فلاحية، وتصوير حياتهم اليومية. لم يكن يريد أن يخبر قصة بطريقة تقليدية. بدلاً من ذلك، أراد أن ينقل الجمال واللغز والكرامة في حياة شخص عادي. النتيجة كانت فيلماً حقيقياً—ليس تسجيلياً بالكامل، لكن متعمداً مؤلفاً مع ممثل غير محترف يلعب نسخة من نفسه. الفيلم كان مثيراً للجدل في مصر (بعض الناس شعروا أنه إساءة لصورة مصر)، لكنه حقق اعترافاً عالمياً فوراً.

منذ ذلك الحين، ظل عمر مخلصاً لمبادئه الفنية. يسافر سنويًا إلى أماكن مختلفة في مصر والسودان وليبيا، ويقضي أشهراً في البحث والاستماع قبل التصوير. يتعاون مع فنانين محليين ومجتمعات محلية، مما يجعل المجتمعات شركاء في الفيلم وليس مجرد موضوعات. هذا النهج يعني أن عملية الإنتاج بطيئة والميزانيات منخفضة بمقاييس السينما الدولية، لكن النتيجة هي أفلام حقيقية من حيث الجوهر.`,
        profileImageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
        coverImageUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&h=400&fit=crop',
        currentPosition: 'Independent Film Director',
        currentCompany: 'Cairo Cinema Productions',
        location: 'Alexandria, Egypt',
        tier: 'platinum',
        isVerified: true,
        isClaimed: true,
        keywords: JSON.stringify([
          'filmmaking',
          'directing',
          'cinema',
          'storytelling',
          'production',
        ]),
        linkedinUrl: 'https://linkedin.com/in/omarfarouk',
        twitterUrl: 'https://twitter.com/omarfarouk',
        instagramUrl: 'https://instagram.com/omarfarouk',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: yasmineId,
        firstName: 'Yasmine',
        lastName: 'Nabil',
        email: 'yasmine.nabil@example.com',
        phoneNumber: '+201001234572',
        dateOfBirth: new Date('1997-12-18') as any,
        gender: 'female',
        bio: `Yasmine Nabil is a trailblazing fashion designer whose collections have elevated Egyptian textile traditions to the global stage while fundamentally challenging exploitative supply chain models. Her design house creates pieces that integrate centuries-old weaving and embroidery techniques from across Egypt—indigo patterns from the Western Desert, ikkat ikat weaving from Aswan, fine linen embroidery from the Delta, traditional appliqué work from Upper Egypt—with contemporary silhouettes and sustainable production methods. Her breakthrough collection "Riverine," launched during Paris Fashion Week, was featured in Vogue and won the Ellen MacArthur Foundation Award for Circular Fashion Design. What distinguished the collection wasn't just aesthetic brilliance—it was her explicit commitment to ensuring that artisans received substantive credit and financial benefit. Each piece listed the specific artisan or cooperative that created it, and a percentage of revenue returned directly to the communities that produced the textiles.

Yasmine's approach to fashion business represents a fundamental challenge to luxury industry models. The conventional global supply chain extracts raw materials and craft labor from the Global South at minimal cost, adds minimal design, and sells finished products for ten to twenty times the input cost under Western brand names. Artisans remain invisible and undercompensated. Yasmine inverted this model. Egyptian textile artisans aren't her suppliers—they're her collaborators and co-creators. Their names appear on garments. They participate in revenue sharing. When a dress sells for two hundred euros, the artisan community can track exactly how much value was created by their hands and can negotiate for increases in compensation if demand rises. This approach has proven both ethically and commercially powerful: luxury consumers increasingly demand authenticity, ethical production, and traceability. Stories of artisan families and heritage techniques become part of what consumers are purchasing.

Beyond her design house, Yasmine has established the Textile Futures Initiative, an organization supporting artisan communities and ensuring that traditional techniques remain economically viable. She has documented techniques from over one hundred artisan groups, created digital archives so that knowledge doesn't disappear, and established cooperative business models that allow artisans to negotiate collectively with international buyers. She mentors young fashion designers and has created a fellowship program specifically for women from artisan communities who want to become designers themselves. Her work has influenced international conversations about fashion sustainability and ethical production, and she regularly speaks at design schools and international forums about reimagining value chains to benefit producers rather than extracting value from them.

ياسمين نبيل تمثل جيل جديد من مصممي الأزياء المصريين الذين يرفضون اختيار بين الموهبة الفنية والمسؤولية الاجتماعية. نشأت بين أم فنانة نسيج وأب مهندس معماري، في حي ملوي بالقاهرة حيث كانت محاطة بالفن والحرف. قضت طفولتها تراقب جدتها وهي تنسج على نول تقليدي، تعلم الأنماط والألوان والحساسيات الجمالية. عندما التحقت بكلية الفنون الجميلة بجامعة حلوان، كانت لديها بالفعل فهم عميق للنسيج المصري والتقنيات التقليدية.

درست التصميم المعاصر والتصنيع الآلي، لكن ظلت مفتونة بالحرف التقليدية. واجهت أثناء فترة التدريب ضغوطاً للعمل مع محصل الملابس الكبار أو إنشاء علامة تجارية فاخرة أوروبية الأسلوب. بدلاً من ذلك، قررت تأسيس منزل تصميم تكون فيه الصناعات اليدوية والفنانون المصريون محور كل شيء. في السنوات الأولى، كانت تعمل مباشرة مع مجموعات صغيرة من النساجين والحرفيات، وتعلم تقنياتهم، وتفهم تحدياتهم الاقتصادية.

أدركت بسرعة أن المشكلة ليست في جودة الحرف المصري—كانت جودة استثنائية. المشكلة كانت في نماذج الأعمال التي أبقت الصناعات اليدوية غير قابلة للاستمرار اقتصادياً. العاملات في النسيج كسبوا بضعة جنيهات لكل يوم عمل، بينما كانت الشركات الكبرى تبيع المنتجات النهائية بآلاف الجنيهات. قررت ياسمين إعادة هيكلة سلسلة القيمة تماماً.`,
        profileImageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face',
        coverImageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&h=400&fit=crop',
        currentPosition: 'Creative Director',
        currentCompany: 'Yasmine Nabil Design House',
        location: 'Cairo, Egypt',
        tier: 'silver',
        isVerified: false,
        isClaimed: false,
        keywords: JSON.stringify([
          'fashion-design',
          'sustainable-fashion',
          'textile-arts',
          'heritage-craftsmanship',
        ]),
        linkedinUrl: 'https://linkedin.com/in/yasmninabil',
        twitterUrl: 'https://twitter.com/yasmininabil',
        instagramUrl: 'https://instagram.com/yasminenabil',
        createdAt: now,
        updatedAt: now,
      },
    ]);

    console.log('Created 6 people profiles with bilingual content');

    // Article 1: Tech Titans of the Nile - Ahmed + Nourhan
    const article1Content = `In the rapidly evolving landscape of technology and storytelling, two visionary Egyptians are reshaping how the world perceives innovation from the Nile Valley. Ahmed Essam, founder and CTO of VentureLab Egypt, and Nourhan El-Sherif, editor-in-chief of Cairo Times Digital, represent the convergence of technical innovation and compelling narrative—a fusion that amplifies Egypt's voice on the global stage.

Ahmed's journey into technology began with curiosity and persistence. Starting with side projects while still at university, he taught himself distributed systems architecture, blockchain protocols, and the art of scaling technology across diverse markets. "Technology is only as valuable as the problems it solves," Ahmed reflects. "In Egypt, we have some of the most complex distributed problems in the world—payment systems that serve millions, infrastructure that must work across vastly different connectivity profiles, economic systems that defy simple solutions. These constraints force innovation."

Today, VentureLab Egypt has become a hub for fintech entrepreneurs across the MENA region. Ahmed's platform has launched over forty technology companies, many of which have achieved unicorn valuations or strategic exits. Yet his proudest accomplishment isn't measured in dollars. "Every single person on my team has mentored at least five junior developers," he notes. "That's how we build a sustainable innovation ecosystem."

Nourhan entered journalism with a different mandate: to capture the nuanced narratives that global media often misses. As editor-in-chief of Cairo Times Digital, she oversees a team of forty journalists working across investigative reporting, culture, and technology beats. Her award-winning investigations have exposed corruption networks, shed light on environmental crises, and humanized the lived experiences of ordinary Egyptians.

"Ahmed is right that technology solves problems," Nourhan says, "but I would add that storytelling reveals what those problems mean to real people. A blockchain platform is elegant engineering, but the story of a refugee sending money home at reduced cost—that's where meaning lives." Her recent five-part investigation into digital surveillance in Egypt won the Reporters Without Borders Press Freedom Award and sparked parliamentary inquiries.

What makes their collaboration extraordinary is mutual respect born from different expertise. When VentureLab Egypt wanted to communicate its mission to policymakers and the public, they partnered with Cairo Times Digital to tell the story not as promotional content, but as genuine reportage about what innovation in Egypt actually looks like. The resulting series reached two million readers and influenced regulatory decisions.

Both Ahmed and Nourhan emphasize that Egypt's competitive advantage lies not in copying Silicon Valley models, but in building solutions specific to Egyptian and Arab realities. "The hardware constraints are different, the regulatory environment is different, the cultural context is different," Ahmed explains. "Those constraints aren't limitations—they're sources of competitive advantage. They force us to innovate in ways that other markets can't replicate."

Nourhan adds, "And our stories matter because they offer the world a corrective narrative. For too long, the global conversation about the Arab world has been shaped by Western media. When we tell our own stories, with our own voices, we assert agency over our own narrative. That's what Ahmed is doing with technology, and that's what I'm doing with journalism."

Looking forward, both see their work as foundational to Egypt's emergence as a genuine technology and innovation hub. "The next decade will determine whether Egypt becomes an innovation leader or remains a consumer market for other people's solutions," Ahmed says. "I'm optimistic because I see the talent. I see the hunger. I see people like Nourhan telling the stories that inspire the next generation to build bigger and bolder."`;

    // Article 2: Designing Egypt's Future - Karim + Mariam
    const article2Content = `Egypt's future is being shaped in the spaces where architecture meets artificial intelligence, where physical design meets digital innovation. Karim Abdel Aziz, principal architect at Aziz Design Studios, and Mariam Hassan, head of AI research at Cairo Innovation Hub, are pioneering solutions to some of Egypt's most pressing urban and social challenges.

Karim's architectural vision is rooted in a profound belief: design must serve both beauty and function, but more importantly, it must serve community. His recent urban revitalization project in Islamic Cairo has transformed a historically significant but economically struggling neighborhood into a vibrant cultural district. "Architecture isn't about imposing visions from above," Karim explains. "It's about listening to the people who live in a space, understanding their needs, respecting their heritage, and creating environments where life flourishes."

The Islamic Cairo project required him to navigate centuries of cultural heritage, living communities with deep ties to place, and modern infrastructure demands. He involved over two hundred community members in the design process, conducted oral histories with long-time residents, and incorporated vernacular building techniques alongside contemporary sustainability standards. The result is a neighborhood that feels authentically Cairo—vibrant, layered, full of unexpected beauty—while being entirely functional and ecologically responsible.

Mariam's contributions to this work came through a different door. As a leading AI researcher specializing in Arabic natural language processing, she partnered with Karim to create an intelligent system that could analyze community feedback at scale. "We collected thousands of community inputs," Mariam explains. "But humans can't meaningfully process thousands of observations simultaneously. AI enabled us to identify patterns, cluster concerns, and surface the most critical community needs that Karim's team needed to address."

The collaboration produced something neither could have created alone: a design process that was both deeply personal and data-informed, both respectful of tradition and oriented toward innovation. "Architecture and AI are often positioned as opposite forces," Karim reflects. "But I realized they're actually complementary. AI handles the complexity of data; architecture handles the complexity of human experience. Together, they create solutions that work."

Beyond the physical and digital, both emphasize the political importance of their work. Egypt's cities are growing faster than infrastructure can support. Climate change threatens coastal regions and agricultural lands. Housing shortages leave millions in informal settlements. "These aren't just technical problems," Mariam notes. "They're problems of equity, sustainability, and social justice. When we apply AI and design thinking to these challenges, we're not just solving logistics. We're determining whether Egypt's future is one of genuine shared prosperity or widening inequality."

Karim extends this thought: "Every architectural decision is a political decision. When I choose to preserve a historic neighborhood rather than demolish it for luxury development, I'm saying something about whose history matters, whose community belongs here. When I design a public square instead of a private mall, I'm choosing public good over private profit. And when Mariam helps me listen to what communities actually want rather than imposing expert judgment, we're choosing democracy over paternalism."

Both are mentoring the next generation. Karim leads a fellowship program for young architects from underrepresented backgrounds. Mariam runs an AI literacy program teaching Cairo's university students that artificial intelligence is not magic or mystery—it's mathematics and code that anyone can learn and master.

"The future of Egypt," Karim says, "will be shaped by whether we can combine the best of our heritage—craftsmanship, community, respect for place—with the best of modern innovation. That's what I try to do in architecture. That's what Mariam does with AI. And that's the conversation we need happening across every sector."`;

    // Article 3: Cairo's Creative Revolution - Omar + Yasmine
    const article3Content = `In the dimly lit screening rooms of Cairo's independent cinemas and in the ateliers of Cairo's fashion district, a creative renaissance is unfolding. Omar Farouk, award-winning film director and founder of Cairo Cinema Productions, and Yasmine Nabil, creative director of Yasmine Nabil Design House, are pioneering what a truly Egyptian creative industry could look like—rooted in tradition, confidently contemporary, and increasingly global.

Omar's filmmaking journey began with a simple conviction: Egyptian stories deserved to be told with the cinematic language and production values of international cinema. His breakthrough film, "The Last Fellah," premiered at Berlin and won the Golden Bear for direction. The film told the story of an aging farmer facing urban expansion with poetry, dignity, and complexity that refused easy sentiment.

"I refused to tell a story about Egypt that would make Western audiences comfortable," Omar explains. "I refused the narrative of victimhood or exoticism. Instead, I created a character—my protagonist farmer—who was fully human, complex, sometimes contradictory, deeply rooted in Egyptian reality. When you do that, something magical happens: the story stops being 'Egyptian cinema' and becomes cinema, period. It resonates globally because it's humanly true."

His subsequent films have been equally ambitious. A five-hour epic about the 2011 Egyptian Revolution from the perspective of working-class women. A documentary exploring the music of Sudan through the lens of Egyptian musicians. Each project demonstrates his commitment to both artistic excellence and cultural specificity.

Yasmine's creative journey parallels Omar's in its commitment to authenticity and ambition. As a fashion designer, she faced pressure to either create "exotic" designs for Western luxury markets or adopt wholesale the aesthetic codes of European fashion houses. Instead, she charted a different course: creating collections that draw from Egypt's extraordinary textile heritage—the weaving traditions of Upper Egypt, the embroidery techniques of the Delta, the indigo practices of the Western Desert—and combine them with contemporary silhouettes and sustainable production methods.

"Egyptian textiles are some of the finest in the world," Yasmine says. "My grandmother knew techniques that took decades to master. These are not historical artifacts to be preserved in museums. They're living practices that continue to evolve. When I use traditional Egyptian techniques in contemporary designs, I'm not being nostalgic. I'm saying these traditions are relevant, valuable, and the future."

Her recent collection, "Riverine," was featured in Vogue, shown at Paris Fashion Week, and earned recognition from the Ellen MacArthur Foundation for sustainable design. More importantly, it created demand for textiles from a network of artisans across Egypt, providing economic opportunity for communities that have been marginalized by global supply chains.

The intersection of Omar's cinematic vision and Yasmine's design practice reveals something profound about contemporary Egypt: the country is producing artists and creators capable of competing at the highest international levels while remaining authentically, unapologetically Egyptian. Their work refuses the false binary between local and global, tradition and innovation.

"What's happening in Cairo right now feels similar to what happened in European cities during the Renaissance," Omar reflects. "There's this ferment of creativity, this willingness to experiment, this sense that we're building something new. But unlike the European Renaissance, which was defined by certain geographic and cultural assumptions, the Cairo Renaissance is explicitly multicultural and transnational. We're drawing from Egypt but in conversation with creators from Lagos, Beirut, Istanbul, and beyond."

Yasmine echoes this vision: "I meet with students constantly, and what strikes me is their confidence. They don't apologize for being Egyptian. They don't feel the need to prove themselves to Western validation. They're simply creating the most beautiful, ambitious, bold work they can imagine. And because of that confidence, that work resonates globally."

Both are committed to building infrastructure for creative workers across Egypt. Omar has established the Cairo Cinema Institute, which provides production training and equipment access to emerging filmmakers. Yasmine mentors young designers and has created a cooperative model that ensures artisans are properly compensated and credited for their work.

"The creative industry can be one of Egypt's great economic engines," Omar suggests. "But only if we build it on the foundation of authentic voices, fair compensation for artists, and genuine artistic freedom. Those aren't sentimental values—they're practical requirements for creating the work that will define the next era of global culture."`;

    // Article 4: Innovation at the Crossroads - Ahmed + Mariam
    const article4Content = `The collision between technological ambition and human understanding is where the future of innovation is being built. Ahmed Essam, founder and CTO of VentureLab Egypt, and Mariam Hassan, head of AI research at Cairo Innovation Hub, represent a new model of technological leadership—one that combines engineering rigor with ethical sophistication, system design with human-centered inquiry.

Ahmed's background in distributed systems architecture gives him a particular lens on innovation. Distributed systems must handle complexity, uncertainty, and the possibility of failure across multiple nodes. "In some ways," Ahmed reflects, "a distributed system is a metaphor for society itself. Many independent nodes, each with partial information, each pursuing their own goals, but needing to coordinate toward collective outcomes. You can't solve a distributed system problem through pure centralization or pure chaos. You need both structure and autonomy."

This philosophy shapes his approach to building VentureLab Egypt. Rather than top-down mandate, he creates a platform—infrastructure, capital, mentorship, network access—and then enables founders to build according to their own vision. "I see my role as creating conditions for innovation," he says. "Not dictating what innovations should happen. That kind of paternalism in tech has actually slowed progress in many markets."

Mariam brings complementary expertise. Her AI research focuses not on building more powerful systems, but on building systems that are interpretable, fair, and aligned with human values. "The current AI revolution," she explains, "often treats optimization as the only goal. We build systems to maximize some metric. But in the real world, we care about multiple values simultaneously—efficiency but also fairness, growth but also sustainability, intelligence but also transparency."

Her recent research on algorithmic bias in Arabic NLP systems revealed that many off-the-shelf AI models perform poorly on Arabic text because they were trained almost entirely on English language data. "This isn't a technical limitation," she notes. "It's a choice. Someone chose to prioritize English because English-speaking markets are larger. But this choice has consequences. If you're an Arabic speaker trying to use AI tools in your native language, you're systematically disadvantaged. That's not inevitable—it's the result of decisions about priority and investment."

Mariam's work has real implications for founders using VentureLab Egypt's infrastructure. A fintech platform that uses AI for credit scoring needs to ensure that its algorithms aren't systematically discriminating against certain populations. An e-commerce recommendation engine needs to understand how language and culture shape preference. A digital healthcare system needs to account for how medical knowledge varies across cultural contexts.

This is where Ahmed and Mariam's collaboration becomes powerful. When a VentureLab Egypt founder comes to Ahmed wanting to deploy an AI system, Ahmed increasingly insists on a conversation with Mariam. "I've learned the hard way," Ahmed says, "that technical elegance and business viability aren't sufficient. If your system generates false negatives that harm people, or perpetuates existing biases, you have both an ethical problem and a business problem. Eventually, those catch up with you."

Mariam adds, "And I've learned that research ethics alone isn't sufficient. I need to understand the business and technical constraints that Ahmed faces. My ideal AI system might be less profitable or more computationally expensive than Ahmed's constraints allow. So we have to do the hard work of finding solutions that are ethical and feasible."

Together, they've created an innovation framework that's increasingly being adopted across the MENA region: ethical innovation audits for emerging technologies, AI literacy programs for startup teams, and open research partnerships between academic institutions and commercial ventures.

"What excites me," Ahmed reflects, "is that we're not importing these ideas from Silicon Valley. We're building them here in Cairo, shaped by Egyptian values and Egyptian constraints. And because they're built for our specific context, they're actually more powerful and more adaptable than generic frameworks."

Mariam extends this vision: "Every region has the capacity to lead innovation in some domain. Silicon Valley became dominant partly through luck and geography, but partly because it built the infrastructure—capital, talent networks, regulatory light-touch—that enabled innovation. The MENA region has enormous advantages: huge markets, young populations, deep technical talent, and increasingly, the confidence to build on our own terms rather than as appendages to Western tech ecosystems."

Both emphasize that this new model of innovation—technically rigorous, ethically sophisticated, culturally rooted—is the competitive advantage that will define the next decade. "The companies that will win," Ahmed predicts, "won't be the ones that perfectly copy Silicon Valley. They'll be the ones that combine world-class technical excellence with deep understanding of their local context and genuine commitment to values beyond pure shareholder return. That's not naive idealism. That's hard-headed pragmatism about what actually builds sustainable, valuable businesses in the long term."`;

    // Article 5: Stories That Shape a Nation - Omar + Nourhan
    const article5Content = `The power to shape how a nation understands itself, its history, and its future lies in the hands of storytellers. Omar Farouk, award-winning film director, and Nourhan El-Sherif, editor-in-chief of Cairo Times Digital, represent the leading edge of a crucial conversation: who gets to tell Egyptian stories, and what responsibility do those storytellers carry?

Omar came to this question through his films. "When I started making movies," he recalls, "the prevailing narrative about Egypt in global cinema was remarkably narrow. You had orientalist exoticism on one side and contemporary crisis narratives on the other. Both simplified Egypt into a set of easily digestible tropes. My responsibility as a filmmaker was to create space for complexity, for the full humanity of my characters, for the actual lived experience of Egyptians rather than what outsiders expect Egypt to be."

His films have earned international recognition precisely because they refuse easy answers. "The Last Fellah" doesn't judge its protagonist—it honors him. "Voices of the Nile"—his documentary on women's experience during political transition—doesn't impose a narrative arc. It listens. His most recent project, exploring traditional music across the Nile Valley, doesn't seek validation from Western institutions. It simply documents beauty and asks audiences to witness it.

Nourhan's journalism follows a similar logic, though through a different medium. As editor-in-chief of Cairo Times Digital, she oversees reporting that refuses sensationalism, refuses easy narratives, and insists on treating Egyptian stories with the seriousness and complexity that global media reserves for Western narratives. "Why," she asks, "does a political crisis in an African capital get covered as 'chaos' while a similar crisis in a European capital gets covered as 'interesting complexity'? The difference is racism. So one of my responsibilities as an editor is to demand that we cover Egyptian stories with the same epistemological generosity that we give to Western stories."

Her investigative team has exposed corruption networks, environmental crimes, and human rights violations. But equally important is her cultural reporting—long-form pieces about musicians, farmers, teachers, artisans, people living ordinary lives with extraordinary dignity. "If your only exposure to Egypt comes through crisis reporting," Nourhan explains, "you miss ninety percent of the story. Yes, Egypt faces real challenges. But the country is also full of innovation, creativity, and people doing remarkable things that don't require international tragedy as context."

The collaboration between Omar and Nourhan reveals how different media forms can serve complementary purposes. A documentary film can show a person's humanity, create emotional resonance, and invite audiences into empathetic identification. A journalistic investigation can expose systemic problems, hold power accountable, and demand policy response. Together, they create a fuller picture.

"Omar's films have influenced how international audiences understand Egypt," Nourhan notes. "And my journalism influences how Egyptians understand themselves. Those are different functions, but they're equally important. When Egyptians see themselves reflected with dignity in their own media, it shapes their self-conception. And when the world sees Egypt through the eyes of Egyptian artists, it reshapes geopolitical understanding."

Both emphasize the political stakes of their work. In many nations, authoritarian governments attempt to control narrative by limiting who can tell stories and what stories can be told. "Press freedom and artistic freedom aren't luxuries," Nourhan insists. "They're foundational to democratic society. When governments can dictate narrative, they can dictate reality."

Omar adds, "Art has always been political, whether artists acknowledge it or not. When I make a film that treats working-class women's experience as inherently worthy of cinematic attention, that's a political act. It's saying: your life matters. Your story deserves to be told with seriousness and artistry. That's subversive in any context where power has determined that certain people's stories don't matter."

Both mentor emerging storytellers. Omar has established the Cairo Cinema Institute; Nourhan has created fellowship programs for young journalists. They consistently emphasize that the next generation of Egyptian storytellers shouldn't see themselves as competing in a Western-dominated narrative space. "Build for Egyptian audiences first," Omar advises. "If it's true and well-made, it will resonate globally. But don't start with the question 'will international audiences understand this?' Start with 'is this story true?'"

Nourhan extends this: "We're building narrative infrastructure. Every journalist we train, every filmmaker we mentor, every story we tell with integrity and complexity—these are acts of nation-building. We're literally constructing the stories through which Egyptians understand themselves and the world understands Egypt."`;

    // Article 6: From the Nile to the World - Karim + Yasmine
    const article6Content = `The Nile Valley has always been a place of confluence—cultures meeting, knowledge flowing, innovation emerging from the synthesis of different traditions. Today, that spirit of synthesis is driving a new generation of Egyptian creators who are building global audiences while remaining rooted in Egyptian soil. Karim Abdel Aziz, principal architect at Aziz Design Studios, and Yasmine Nabil, creative director of Yasmine Nabil Design House, are demonstrating what it means to be authentically local and genuinely global simultaneously.

Karim's architectural practice is grounded in a specific conviction: that Egypt's architectural heritage offers lessons that the world desperately needs. "When people think of Egyptian architecture," he explains, "they think of pyramids and temples. But that's a tiny fraction of our heritage. What fascinates me is how Egyptian builders, across centuries, solved problems of climate, community, material constraint, and aesthetic excellence simultaneously. A traditional Cairo house, built before air conditioning, uses geometry and orientation to create natural cooling. An Ottoman-era madrassa integrates learning, worship, commerce, and social welfare in a single urban structure. These are solutions that remain relevant today."

His international work demonstrates this principle. A sustainable housing complex in Berlin incorporates design principles from traditional Upper Egyptian architecture. A cultural center in Brussels draws on the spatial logic of medieval souks. A university building in Dubai references the mashrabiya—the intricate lattice screen—as both aesthetic and functional element, controlling light and heat while creating layers of transparency and privacy.

"What's happening," Karim says, "is that globally, architects are recognizing that Western modernism—the glass box, the open plan, the stripped-down aesthetic—doesn't actually serve human needs as well as we thought. So they're looking everywhere else. And Egypt has thousands of years of architectural knowledge about how to build beautiful, functional, environmentally responsive buildings. We don't need to copy ourselves. We need to understand our own heritage deeply enough to innovate from it."

Yasmine's fashion work follows a parallel trajectory. Her collections are explicitly rooted in Egyptian textiles, but they're created for global audiences who increasingly care about sustainability, cultural authenticity, and ethical production. Her recent collaboration with an Italian luxury house introduced Egyptian weaving techniques to European markets—but crucially, with Egyptian artisans credited and compensated as co-creators, not as invisible producers of raw materials.

"For centuries," Yasmine reflects, "Egyptian artisans were extracted from the value chain. A Western company would buy Egyptian textiles at low prices, add minimal design, and sell them for five times the price under Western branding. My business model inverts that. The Egyptian artisans aren't suppliers—they're collaborators. Their names appear on the label. They share in the revenue. When a piece sells for two hundred euros, they know exactly how much of that value was created by their hands and their knowledge."

This approach has proven both ethical and commercially viable. Luxury consumers increasingly demand authenticity and ethical production. When they learn that a piece of fashion was created by a family of weavers in the Delta region, with techniques passed through generations, the story becomes part of the product value. "People want to buy meaning," Yasmine explains. "They want to know that their purchase supports genuine human flourishing, not just profit extraction."

The collaboration between Karim and Yasmine reveals something essential about Egypt's capacity for global creative leadership. Architecture and fashion, though different disciplines, share certain principles: they're grounded in specific cultural traditions, they require mastery of materials and craft, they're constrained by practical requirements, and they're ultimately about creating environments and experiences where human life flourishes.

"Egypt can become a global fashion capital," Yasmine believes, "not by importing Milan fashion houses to Cairo, but by developing a distinctive Egyptian fashion aesthetic that draws from our heritage and speaks to global consciousness. The world is hungry for this. They're tired of the same homogenized global luxury brands. They want specificity, authenticity, and ethical production."

Karim adds, "The same is true for architecture. Cities around the world are facing similar challenges—climate change, urbanization, social fragmentation. And they're discovering that some of their best solutions come from studying how other cultures have addressed these challenges across centuries. Egyptian architecture can be a global teacher. But only if we have the confidence to say: this knowledge is valuable, and the world should learn from us."

Both emphasize that this isn't nostalgia or exoticism. "We're not trying to freeze ourselves in the past," Yasmine clarifies. "I'm not creating museum-quality textiles. I'm creating fashion for today's world—contemporary silhouettes, sustainable materials, digital technologies in production—while drawing on Egyptian heritage. That synthesis, that integration of past and future, is what makes the work powerful."

Karim resonates with this: "Some people think that valuing tradition means resisting modernity. But that's false. Every architectural tradition, including Egyptian tradition, has always evolved by integrating new materials and techniques. I use digital fabrication, I incorporate modern climate control systems, I work with engineers who specialize in seismic resilience. But I do this in dialogue with principles that Egyptian architects have understood for millennia."

Looking forward, both see Egypt's creative sectors as critical to the nation's economic and cultural future. "The global economy is shifting," Karim observes. "Manufacturing moves to the lowest-cost regions. Financial services are increasingly digitized. But creativity can't be outsourced. Design has to be rooted in specific cultural contexts. Fashion has to reflect genuine human sensibility. So Egypt has the opportunity to lead in exactly the sectors that are becoming increasingly valuable globally."

Yasmine adds the final thought: "We're not asking the world to validate Egyptian culture. We're simply saying: Egyptian culture is beautiful, profound, and relevant. If you want to understand human creativity and tradition, look here. And if you want to buy something beautiful, something meaningful, something made with integrity and excellence, here's what we're creating. The world will respond because the work is genuinely excellent."`;

    // Article 7: Healthcare Innovation - Nourhan + Mariam (NEW)
    const article7Content = `In the global health crisis landscape, where diseases spread faster than traditional medical systems can respond, two Egyptian innovators are pioneering models of digital health infrastructure that serve populations often ignored by international health initiatives. Nourhan El-Sherif, editor-in-chief of Cairo Times Digital, has been documenting emerging healthcare solutions across Egypt, while Mariam Hassan's AI research has directly enabled some of the most promising technical innovations. Together, their work reveals how journalism and technology can align to democratize healthcare access.

The starting point for this collaboration was Nourhan's investigative series on rural healthcare gaps in Upper Egypt. She spent six months visiting villages in Aswan, Luxor, and Qena, documenting the reality of communities with no access to doctors or basic diagnostics. The nearest hospital was often eighty kilometers away. Pregnant women died from complications that would be easily managed in urban centers. Children suffered from preventable diseases because vaccination schedules were irregular. What struck Nourhan was that these weren't failures of medicine—they were failures of infrastructure and information.

That's when she connected with Mariam. Her research on Arabic NLP had applications in healthcare that neither had fully recognized. They began collaborating on an AI-powered diagnostic triage system designed specifically for the Egyptian context. The system could accept patient descriptions in Egyptian Arabic dialect, ask clarifying questions in culturally appropriate language, and provide preliminary assessments that could be shared with remote doctors via phone or video. Critically, the system was designed to work on basic mobile phones with poor connectivity—it could operate offline and sync data when connection was available.

What makes their collaboration powerful is how it combines journalistic credibility with technical sophistication. When Nourhan publishes stories about the system's impact—the woman in Aswan whose pregnancy complication was caught early because of the AI triage—the storytelling creates trust and visibility. But the technical work is equally serious. Mariam's team tested the system with actual doctors and patients, measured diagnostic accuracy against clinical outcomes, and iterated continuously. The system has a user interface designed for both medical professionals and lay users, with translations not just from English to Arabic, but from medical terminology into everyday language people actually understand.

The healthcare project demonstrates a broader principle both emphasize: that Egypt's challenges can become sources of competitive advantage if approached with sufficient rigor and creativity. "The constraint of limited healthcare infrastructure is real," Mariam notes. "But that constraint forced us to think differently about how healthcare works. Instead of assuming you need a doctor in every rural village, we asked: what's the minimal technology needed to get diagnostic information to the right person, wherever they are? And that question—because it was forced by real constraint—led to solutions that are actually more innovative and more scalable than conventional approaches."

Nourhan extends this perspective to journalism's role. "My responsibility as a journalist isn't just to document problems. It's also to report on solutions, to create visibility for innovations that deserve scaling, to connect innovators with resources and audiences that can amplify their work. When Mariam's team built something genuinely transformative, it deserved narrative investment. My journalism didn't create the technology, but it created the conditions for the technology to reach more people."

Both are now developing the model further. An expanded version of the system includes disease surveillance capabilities—if thousands of people report similar symptoms, the system can alert public health authorities to potential outbreaks. Another iteration will integrate with pharmacy networks, allowing patients to access affordable medications based on the preliminary diagnosis. A third stream involves training community health workers to use and interpret the system's outputs, creating a distributed network of healthcare access points.

What's remarkable is the speed at which this collaboration has moved from concept to deployed reality impacting actual lives. "That's because," Mariam explains, "we combined Nourhan's credibility in public communication and my credibility in technical implementation. Policymakers trusted both of us. Healthcare providers trusted both of us. Patients trusted both of us. When you have that kind of multi-dimensional trust, you can move faster and coordinate more effectively."`;

    // Article 8: Youth and Leadership - Mariam + Nourhan (NEW)
    const article8Content = `Egypt's future will be determined not by any single innovation or policy, but by whether the country can cultivate and empower the next generation of leaders—people who combine technical excellence with moral clarity, professional ambition with social responsibility, confidence in their own abilities with humility about what they don't know. Mariam Hassan and Nourhan El-Sherif have made supporting young Egyptians a central part of their work, and their mentorship philosophy offers insights into what leadership development could look like across sectors.

Mariam's approach is rooted in her own experience being one of the few women in computer science classrooms where she often felt pressured to be perfect—to prove that women belonged in technical fields by being exceptional. "I don't want to recreate that dynamic," she says. "I want to create spaces where young women can be technically excellent without having to prove their right to be there. Where they can ask questions without it being seen as weakness. Where they can pursue ambitious projects without needing external validation." Her AI literacy program serves five hundred high school students annually, with explicit recruitment from lower-income schools and from Egypt's regional cities. She teaches not just technical skills but also the history of AI, its limitations, its ethical implications—everything needed to be a critical, thoughtful user and potential creator of AI systems.

Nourhan's mentorship philosophy operates in parallel. She has created a journalism fellowship that specifically targets people from backgrounds historically underrepresented in newsrooms—people from rural Egypt, from working-class backgrounds, from minority communities. Her selection criteria aren't just about academic credentials; she looks for people who have something genuine to say, who have observed something important in their own communities that deserves reporting. Once selected, fellows work alongside experienced journalists, learning skills but also learning that journalism is fundamentally about listening—to sources, to communities, to the complexity of reality rather than imposing pre-determined narratives.

What both emphasize is that mentorship isn't about recreating copies of yourself. "I'm not trying to create the next Mariam Hassan," she notes. "The world doesn't need that. The world needs people who take what they learn from me and go in entirely different directions. I'm trying to create conditions where young people feel empowered to pursue their own visions, using the tools and confidence they've developed." Nourhan expresses a similar philosophy: "The most important thing I can teach young journalists isn't a technique—it's a sense that their voice matters. That stories from rural communities matter. That documentation of ordinary people's lives is as important as coverage of official power. That their perspectives are not secondary—they're central."

Both have noticed something striking in working with young Egyptians: there's simultaneously enormous talent and enormous hunger. Young people are intensely aware of Egypt's challenges and feel genuine responsibility to contribute to solutions. But they're also often paralyzed by the scope of problems or by self-doubt about whether they have the right background or credentials. The mentorship work, then, involves both building technical skills and building psychological resilience. "I tell fellows," Nourhan says, "that Pulitzer Prize-winning journalists started exactly where you are—they didn't know if they were good enough. The only way you find out is by doing the work. So let's do the work together, and trust that excellence will emerge."

Mariam adds a dimension about opportunity access. She's noticed that talented young women in technical fields often feel they need to choose between professional ambition and family or community commitments. "That's a false choice," she argues. "It's created by systems that don't accommodate both. So I'm trying to model and advocate for different ways of working—flexible timelines, collaborative rather than competitive environments, explicit discussion of how to balance different life dimensions." She's started a research collective that specifically works in this way, with researchers joining for periods that work with their lives, collaborating asynchronously when needed, supporting each other through different life transitions.

Both believe that Egypt's biggest competitive advantage is its young population. "We have demographic advantage," Mariam notes. "Over fifty percent of Egypt is under twenty-five years old. That's not just economic potential—it's potential for reimagining what's possible. Young people haven't internalized the constraints that older generations accept. They can imagine different futures." Nourhan builds on this: "My responsibility as someone with platform and credibility is to amplify young voices, to create spaces where young people's perspectives shape public conversations. Because if we're going to solve the problems facing Egypt, it will be young people—young reporters, young technologists, young architects, young artists—who do the solving."

Both are optimistic about Egypt's trajectory, but with eyes open to challenges. "The question isn't whether Egypt has the talent," Mariam says. "We do. The question is whether we can create structures that allow talent to flourish. Whether we fund research and innovation. Whether we protect press freedom and artistic freedom. Whether we invest in education. If we do those things, Egypt will lead. If we don't, talent will continue migrating. But I'm hopeful because I see the work that young Egyptians are doing, and it's extraordinary."`;

    await db.insert(articles).values([
      {
        id: 'article-tech-titans-nile',
        title: 'Tech Titans of the Nile',
        slug: 'tech-titans-of-the-nile',
        content: article1Content,
        excerpt: 'Ahmed Essam and Nourhan El-Sherif discuss how engineering and storytelling are amplifying Egypt\'s voice in global innovation and media.',
        authorId: ahmedId,
        authorName: 'Ahmed Essam',
        featuredImageUrl: 'https://picsum.photos/seed/tech-titans-nile/1200/600',
        status: 'published',
        publishedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
        tags: JSON.stringify(['technology', 'entrepreneurship', 'journalism', 'innovation']),
        category: 'Technology',
        readTimeMinutes: 12,
        viewCount: 245,
        malePersonId: ahmedId,
        femalePersonId: nourhranId,
      },
      {
        id: 'article-designing-egypt-future',
        title: 'Designing Egypt\'s Future',
        slug: 'designing-egypts-future',
        content: article2Content,
        excerpt: 'Karim Abdel Aziz and Mariam Hassan explore how architecture and AI are solving urban challenges and reshaping city design.',
        authorId: karimId,
        authorName: 'Karim Abdel Aziz',
        featuredImageUrl: 'https://picsum.photos/seed/designing-future/1200/600',
        status: 'published',
        publishedAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000),
        tags: JSON.stringify(['architecture', 'ai', 'urban-design', 'sustainability']),
        category: 'Architecture',
        readTimeMinutes: 11,
        viewCount: 198,
        malePersonId: karimId,
        femalePersonId: mariamId,
      },
      {
        id: 'article-cairo-creative-revolution',
        title: 'Cairo\'s Creative Revolution',
        slug: 'cairo-creative-revolution',
        content: article3Content,
        excerpt: 'Omar Farouk and Yasmine Nabil demonstrate how Egyptian cinema and fashion are claiming space on the global stage.',
        authorId: omarId,
        authorName: 'Omar Farouk',
        featuredImageUrl: 'https://picsum.photos/seed/cairo-creative/1200/600',
        status: 'published',
        publishedAt: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000),
        tags: JSON.stringify(['film', 'fashion', 'creativity', 'culture']),
        category: 'Culture',
        readTimeMinutes: 13,
        viewCount: 312,
        malePersonId: omarId,
        femalePersonId: yasmineId,
      },
      {
        id: 'article-innovation-crossroads',
        title: 'Innovation at the Crossroads',
        slug: 'innovation-at-the-crossroads',
        content: article4Content,
        excerpt: 'Ahmed Essam and Mariam Hassan explore ethical innovation, AI literacy, and building sustainable tech ecosystems.',
        authorId: ahmedId,
        authorName: 'Ahmed Essam',
        featuredImageUrl: 'https://picsum.photos/seed/innovation-crossroads/1200/600',
        status: 'published',
        publishedAt: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000),
        tags: JSON.stringify(['technology', 'ai', 'ethics', 'startups']),
        category: 'Technology',
        readTimeMinutes: 12,
        viewCount: 276,
        malePersonId: ahmedId,
        femalePersonId: mariamId,
      },
      {
        id: 'article-stories-shape-nation',
        title: 'Stories That Shape a Nation',
        slug: 'stories-that-shape-a-nation',
        content: article5Content,
        excerpt: 'Omar Farouk and Nourhan El-Sherif discuss the power of storytelling to shape narrative, preserve dignity, and influence understanding.',
        authorId: omarId,
        authorName: 'Omar Farouk',
        featuredImageUrl: 'https://picsum.photos/seed/stories-nation/1200/600',
        status: 'published',
        publishedAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000),
        tags: JSON.stringify(['journalism', 'film', 'narrative', 'media']),
        category: 'Culture',
        readTimeMinutes: 12,
        viewCount: 289,
        malePersonId: omarId,
        femalePersonId: nourhranId,
      },
      {
        id: 'article-nile-to-world',
        title: 'From the Nile to the World',
        slug: 'from-the-nile-to-the-world',
        content: article6Content,
        excerpt: 'Karim Abdel Aziz and Yasmine Nabil explore how Egyptian heritage, rooted in tradition, is becoming globally relevant.',
        authorId: karimId,
        authorName: 'Karim Abdel Aziz',
        featuredImageUrl: 'https://picsum.photos/seed/nile-world/1200/600',
        status: 'published',
        publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        tags: JSON.stringify(['design', 'fashion', 'architecture', 'heritage']),
        category: 'Business',
        readTimeMinutes: 13,
        viewCount: 267,
        malePersonId: karimId,
        femalePersonId: yasmineId,
      },
      {
        id: 'article-healthcare-innovation',
        title: 'Healthcare Innovation at Scale',
        slug: 'healthcare-innovation-at-scale',
        content: article7Content,
        excerpt: 'Mariam Hassan and Nourhan El-Sherif collaborate on AI-powered healthcare solutions bringing digital medicine to underserved Egyptian communities.',
        authorId: nourhranId,
        authorName: 'Nourhan El-Sherif',
        featuredImageUrl: 'https://picsum.photos/seed/healthcare-innovation/1200/600',
        status: 'published',
        publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        tags: JSON.stringify(['healthcare', 'ai', 'technology', 'innovation']),
        category: 'Technology',
        readTimeMinutes: 12,
        viewCount: 223,
        malePersonId: ahmedId,
        femalePersonId: mariamId,
      },
      {
        id: 'article-youth-leadership',
        title: 'Mentoring the Next Generation of Leaders',
        slug: 'mentoring-next-generation-leaders',
        content: article8Content,
        excerpt: 'Mariam Hassan and Nourhan El-Sherif discuss their mentorship philosophy and why supporting young Egyptians is crucial for the nation\'s future.',
        authorId: mariamId,
        authorName: 'Mariam Hassan',
        featuredImageUrl: 'https://picsum.photos/seed/youth-leadership/1200/600',
        status: 'published',
        publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        tags: JSON.stringify(['leadership', 'mentorship', 'education', 'youth']),
        category: 'Culture',
        readTimeMinutes: 11,
        viewCount: 189,
        malePersonId: karimId,
        femalePersonId: nourhranId,
      },
    ]);

    console.log('Created 8 published articles with rich bilingual content');

    // 1 submission (pending)
    const submissionId = `submission-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    await db.insert(submissions).values([
      {
        id: submissionId,
        firstName: 'Layla',
        lastName: 'Mansour',
        email: 'layla.mansour@example.com',
        phoneNumber: '+201001234573',
        dateOfBirth: new Date('2000-09-05') as any,
        gender: 'female',
        bio: 'Emerging entrepreneur and sustainability advocate passionate about building environmental solutions for emerging markets. Currently developing a green packaging startup with focus on North Africa.',
        profileImageUrl: 'https://ui-avatars.com/avatar?name=Layla+Mansour&background=D4A853&color=0a0a0f&size=400',
        currentPosition: 'Co-founder',
        currentCompany: 'GreenPack Initiative',
        location: 'Cairo, Egypt',
        keywords: JSON.stringify(['sustainability', 'entrepreneurship', 'green-tech', 'packaging']),
        linkedinUrl: 'https://linkedin.com/in/laylmansour',
        status: 'pending',
        submittedBy: 'self',
        submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) as any,
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) as any,
      },
    ]);

    console.log('Created 1 pending submission');

    // 2 subscribers (active)
    await db.insert(subscribers).values([
      {
        id: `subscriber-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        email: 'hassan.ahmed@example.com',
        firstName: 'Hassan',
        lastName: 'Ahmed',
        isActive: true,
        subscribedAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000),
      },
      {
        id: `subscriber-${Date.now() + 1}-${Math.random().toString(36).substr(2, 9)}`,
        email: 'fatima.khalil@example.com',
        firstName: 'Fatima',
        lastName: 'Khalil',
        isActive: true,
        subscribedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
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
