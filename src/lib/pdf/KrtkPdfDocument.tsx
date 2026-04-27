import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const s = StyleSheet.create({
  page:        { backgroundColor: '#0f0f0f', padding: 40, fontFamily: 'Helvetica', color: '#f5f0e8' },
  gold:        { color: '#D4A853' },
  header:      { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 24, gap: 16 },
  avatar:      { width: 72, height: 72, borderRadius: 36, objectFit: 'cover' },
  avatarPlaceholder: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#1e1e1e', border: '2px solid #D4A853' },
  name:        { fontSize: 22, fontWeight: 'bold', marginBottom: 4, color: '#f5f0e8' },
  title:       { fontSize: 11, color: '#D4A853', marginBottom: 2 },
  company:     { fontSize: 10, color: '#999' },
  divider:     { borderBottom: '1px solid #2a2a2a', marginVertical: 14 },
  sectionTitle: { fontSize: 9, fontWeight: 'bold', color: '#D4A853', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 },
  bio:         { fontSize: 10, color: '#aaa', lineHeight: 1.6 },
  badgeRow:    { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 14 },
  badge:       { fontSize: 8, color: '#D4A853', borderRadius: 4, border: '1px solid #D4A853', paddingHorizontal: 6, paddingVertical: 2 },
  contactRow:  { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  contactItem: { fontSize: 9, color: '#aaa' },
  footer:      { position: 'absolute', bottom: 24, left: 40, right: 40, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  footerText:  { fontSize: 7, color: '#555' },
  verified:    { fontSize: 8, color: '#D4A853', border: '1px solid #D4A853', borderRadius: 3, paddingHorizontal: 5, paddingVertical: 1 },
});

interface PdfPerson {
  firstNameEn: string;
  lastNameEn: string;
  firstNameAr?: string | null;
  lastNameAr?: string | null;
  currentTitleEn?: string | null;
  currentEmployerEn?: string | null;
  bioEn?: string | null;
  profileImageUrl?: string | null;
  isVerified?: boolean;
  tier?: string;
  contactEmail?: string | null;
  contactPhone?: string | null;
  website?: string | null;
  linkedin?: string | null;
}

interface PdfAchievement {
  titleEn: string;
  organizationEn?: string | null;
  year?: string | null;
}

interface Props {
  person: PdfPerson;
  achievements: PdfAchievement[];
  profileUrl: string;
}

export default function KrtkPdfDocument({ person, achievements, profileUrl }: Props) {
  const fullName = `${person.firstNameEn} ${person.lastNameEn}`.trim();
  const isPremium = person.tier === 'premium';
  const top3 = achievements.slice(0, 3);

  return (
    <Document title={`KRTK — ${fullName}`} author="Cairo Live">
      <Page size="A4" style={s.page}>
        {/* Header */}
        <View style={s.header}>
          {person.profileImageUrl
            ? <Image src={person.profileImageUrl} style={s.avatar} />
            : <View style={s.avatarPlaceholder} />
          }
          <View style={{ flex: 1 }}>
            <Text style={s.name}>{fullName}</Text>
            {person.firstNameAr && (
              <Text style={[s.company, { fontSize: 9, marginBottom: 3 }]}>
                {`${person.firstNameAr} ${person.lastNameAr ?? ''}`.trim()}
              </Text>
            )}
            {person.currentTitleEn && <Text style={s.title}>{person.currentTitleEn}</Text>}
            {person.currentEmployerEn && <Text style={s.company}>{person.currentEmployerEn}</Text>}
          </View>
          {person.isVerified && <Text style={s.verified}>✓ Verified</Text>}
        </View>

        <View style={s.divider} />

        {/* Bio */}
        {person.bioEn && (
          <View style={{ marginBottom: 14 }}>
            <Text style={s.sectionTitle}>About</Text>
            <Text style={s.bio}>{person.bioEn.slice(0, 400)}{person.bioEn.length > 400 ? '...' : ''}</Text>
          </View>
        )}

        {/* Achievements */}
        {top3.length > 0 && (
          <View style={{ marginBottom: 14 }}>
            <Text style={s.sectionTitle}>Notable Achievements</Text>
            <View style={s.badgeRow}>
              {top3.map((a, i) => (
                <View key={i} style={s.badge}>
                  <Text>{a.titleEn}{a.year ? ` · ${a.year}` : ''}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Contact — premium only */}
        {isPremium && (
          <View style={{ marginBottom: 14 }}>
            <Text style={s.sectionTitle}>Contact</Text>
            <View style={s.contactRow}>
              {person.contactEmail && <Text style={s.contactItem}>{person.contactEmail}</Text>}
              {person.contactPhone && <Text style={s.contactItem}>{person.contactPhone}</Text>}
              {person.website && <Text style={s.contactItem}>{person.website}</Text>}
              {person.linkedin && <Text style={s.contactItem}>{person.linkedin}</Text>}
            </View>
          </View>
        )}

        {/* Footer */}
        <View style={s.footer}>
          <Text style={s.footerText}>Cairo Live — Every Egyptian has a story.</Text>
          <Text style={[s.footerText, { color: '#D4A853' }]}>{profileUrl}</Text>
        </View>
      </Page>
    </Document>
  );
}
