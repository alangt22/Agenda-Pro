

export function Footer() {
    return(
        <footer className="py-6 text-center text-gray-500 text-sm md:text-base">
            <p>Todos direitos reservados © {new Date().getFullYear()} - <a href="/" className="hover:text-black duration-300 font-bold">Agenda<span className="text-[#42ff7c]">PRO</span></a></p>
        </footer>
    )
}