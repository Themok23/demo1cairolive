/**
 * Run this script from the project root to update all person images in the database:
 *   npx tsx scripts/update-images.ts
 */
import { db } from '../src/infrastructure/db/client';
import { persons } from '../src/infrastructure/db/schema';
import { eq } from 'drizzle-orm';

const imageMap = [
  {
    id: 'ahmed-essam',
    profileImageUrl: '/uploads/profile-ahmed-essam.png',
    coverImageUrl: '/uploads/cover-ahmed-essam.png',
  },
  {
    id: 'nourhan-el-sherif',
    profileImageUrl: '/uploads/profile-nourhan-el-sherif.png',
    coverImageUrl: '/uploads/cover-nourhan-el-sherif.png',
  },
  {
    id: 'karim-abdel-aziz',
    profileImageUrl: '/uploads/profile-karim-abdel-aziz.png',
    coverImageUrl: '/uploads/cover-karim-abdel-aziz.png',
  },
  {
    id: 'mariam-hassan',
    profileImageUrl: '/uploads/profile-mariam-hassan.png',
    coverImageUrl: '/uploads/cover-mariam-hassan.png',
  },
  {
    id: 'omar-farouk',
    profileImageUrl: '/uploads/profile-omar-farouk.png',
    coverImageUrl: '/uploads/cover-omar-farouk.png',
  },
  {
    id: 'yasmine-nabil',
    profileImageUrl: '/uploads/profile-yasmine-nabil.png',
    coverImageUrl: '/uploads/cover-yasmine-nabil.png',
  },
];

async function updateImages() {
  console.log('Updating person images...\n');

  for (const person of imageMap) {
    try {
      await db
        .update(persons)
        .set({
          profileImageUrl: person.profileImageUrl,
          coverImageUrl: person.coverImageUrl,
        })
        .where(eq(persons.id, person.id));

      console.log(`  Updated: ${person.id}`);
    } catch (error) {
      console.error(`  Failed: ${person.id}`, error);
    }
  }

  console.log('\nDone! All person images updated.');
  process.exit(0);
}

updateImages();
