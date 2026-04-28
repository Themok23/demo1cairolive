'use client';

import { useEffect } from 'react';

interface Props {
  lang: string;
  dir: 'ltr' | 'rtl';
}

export default function HtmlAttributeSetter({ lang, dir }: Props) {
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);
  return null;
}
