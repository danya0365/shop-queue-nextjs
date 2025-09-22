'use client';

import dynamic from 'next/dynamic';
import { PropsWithChildren } from 'react';
import { StickyBoxCompProps } from 'react-sticky-box';

const StickyBoxComponent = dynamic(() => import('react-sticky-box'), {
  ssr: false
});

const StickyBox = ({
  children,
  ...restProps
}: StickyBoxCompProps & PropsWithChildren) => {
  return <StickyBoxComponent {...restProps}>{children}</StickyBoxComponent>;
};

export default StickyBox;
