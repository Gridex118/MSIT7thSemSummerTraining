import type { ReactNode } from "react";
import MailIconSvg from "../../assets/mail-icon.svg?react";
import LinkedinIconSvg from "../../assets/linkedin-icon.svg?react";
import GithubIconSvg from "../../assets/github-icon.svg?react";

type CopyrightSectionProps = { year: number; children: ReactNode };
function CopyrightSection({
  year,
  children: ownerNameLogo,
}: CopyrightSectionProps) {
  return (
    <div id="footer-copyrights">
      <p className="text-sm font-semibold">All Rights Reserved</p>
      <div className="flex gap-3 text-2xl font-bold">
        <p>&#169;</p>
        <p>{year}</p>
        {ownerNameLogo}
      </div>
    </div>
  );
}

type SocialsSectionProps = {
  linkedinUrl?: string;
  githubUrl?: string;
  mailUrl: string;
};
function SocialsSection({
  linkedinUrl,
  githubUrl,
  mailUrl,
}: SocialsSectionProps) {
  const iconClass =
    "*:fill-white [&:hover,&:active]:*:fill-blue-300 dark:[&:hover,&:active]:*:fill-gray-300 size-6";

  return (
    <ul className="flex items-center gap-6 p-2">
      {linkedinUrl && (
        <li>
          <a href={linkedinUrl}>
            <LinkedinIconSvg className={iconClass} />
          </a>
        </li>
      )}
      {githubUrl && (
        <li>
          <a href={githubUrl}>
            <GithubIconSvg className={iconClass} />
          </a>
        </li>
      )}
      <li>
        <a href={mailUrl}>
          <MailIconSvg className={iconClass} />
        </a>
      </li>
    </ul>
  );
}

export default function Footer() {
  return (
    <footer
      id="footer"
      className="mt-auto flex flex-wrap items-center justify-between bg-blue-500 p-4 text-white dark:bg-black"
    >
      <CopyrightSection year={new Date().getFullYear()}>
        <p>
          <span>
            <span className="opacity-40 dark:opacity-60">ROSE</span>GRID
          </span>
          <span>
            <span className="opacity-40 dark:opacity-60">AL</span>EX
          </span>
        </p>
      </CopyrightSection>
      <SocialsSection
        linkedinUrl="https://linkedin/xyz"
        githubUrl="https://github.com/Gridex118"
        mailUrl="mailto:rosegrid58@gmail.com"
      />
    </footer>
  );
}
