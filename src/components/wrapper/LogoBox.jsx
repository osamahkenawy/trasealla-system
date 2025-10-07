import logoDark from '@/assets/images/TRASEALLA.png';
import logoLight from '@/assets/images/logo-light.png';
import logoSm from '@/assets/images/t-for-trasealla.png';
import Image from 'next/image';
import Link from 'next/link';
const LogoBox = () => {
  return <div className="logo-box">
      <Link href="/dashboards" className="logo-dark">
        <Image width={28} height={28} src={logoSm} className="logo-sm" alt="logo sm" />
        <Image width={120} height={60} src={logoDark} className="logo-lg" alt="logo dark" />
      </Link>
      <Link href="/dashboards" className="logo-light">
        <Image width={28} height={28} src={logoSm} className="logo-sm" alt="logo sm" />
        <Image width={98} height={30} src={logoLight} className="logo-lg" alt="logo light" />
      </Link>
    </div>;
};
export default LogoBox;
