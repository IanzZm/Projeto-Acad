function Navbar() {
  return (
    <header className="navbar">
      <a className="navbar__brand" href="/" aria-label="Voltar para a página inicial">
        Projeto Acad
      </a>

      <nav className="navbar__links" aria-label="Navegação principal">
        <a href="#inicio">Início</a>
        <a href="#estrutura">Estrutura</a>
        <a href="#proximos-passos">Próximos passos</a>
      </nav>
    </header>
  )
}

export default Navbar
