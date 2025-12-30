const Footer = () => {
  return (
    <footer className="h-12 bg-slate-900 text-slate-300 flex items-center justify-center text-sm">
      © {new Date().getFullYear()} TaskManager. All rights reserved.
    </footer>
  );
};

export default Footer;
