import QRCode from 'qrcode';

interface Props {
  url: string;
  size?: number;
}

export default async function KrtkQrCode({ url, size = 120 }: Props) {
  const svg = await QRCode.toString(url, {
    type: 'svg',
    width: size,
    margin: 1,
    color: { dark: '#C9A84C', light: '#00000000' },
  });

  return (
    <div
      className="inline-block"
      dangerouslySetInnerHTML={{ __html: svg }}
      aria-label="QR code for this profile"
    />
  );
}
