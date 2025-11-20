export default function Footer() {
  return (
    <footer className="py-6 text-center text-gray-500 text-sm md:text-base">
      <p>
        Todos direitos reservados &copy; {new Date().getFullYear()} -{' '}
        <span className="hover:text-black duration-300">@LeoGuths</span>
      </p>
    </footer>
  );
}
