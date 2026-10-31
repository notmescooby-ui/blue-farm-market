import { Link } from "@tanstack/react-router";
import { BlueFarmLogo } from "@/components/site/Header";

export function Footer() {
  return (
    <footer className="mt-auto bg-deep text-deep-foreground">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <BlueFarmLogo />
            <span className="font-display text-lg font-bold">BlueFarm</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-deep-foreground/75">
            Smart aquaculture, fish farming and a digital fish marketplace for farmers and buyers.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-deep-foreground/60">
            Account & Support
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link to="/account-deletion" className="hover:text-aqua">
                Delete Account
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-aqua">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/track" className="hover:text-aqua">
                Track request
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-aqua">
                Contact Support
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-deep-foreground/60">
            Contact Us
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a href="mailto:bluefarm1572@gmail.com" className="hover:text-aqua">
                bluefarm1572@gmail.com
              </a>
            </li>
            <li>
              <span className="text-xs text-deep-foreground/60">
                Support available for Aquaculture Farmers &amp; Buyers
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-5 text-xs text-deep-foreground/60 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>&copy; {new Date().getFullYear()} BlueFarm. All rights reserved.</p>
          <p>
            Use of this portal is subject to the BlueFarm{" "}
            <Link to="/privacy" className="underline hover:text-aqua">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
