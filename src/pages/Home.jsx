import heroImg from '../assets/hero.png'
import Button from '../components/Button'
import FeatureCard from '../components/FeatureCard'
import { features } from '../data/features'

function Home() {
  return (
    <>
      <section className="hero-section" id="inicio">
        <div className="hero-section__content">
          <span className="eyebrow">React + Vite</span>
          <h1>Projeto acadêmico organizado para crescer</h1>
          <p>
            Estrutura separada por páginas, componentes, templates, estilos e dados. Assim o projeto
            fica mais fácil de apresentar, manter e evoluir.
          </p>

          <div className="hero-section__actions">
            <Button href="https://react.dev/">Documentação React</Button>
            <Button href="https://vite.dev/" variant="secondary">
              Documentação Vite
            </Button>
          </div>
        </div>

        <div className="hero-section__image" aria-hidden="true">
          <img src={heroImg} alt="" />
        </div>
      </section>

      <section className="section" id="estrutura">
        <div className="section__header">
          <span className="eyebrow">Estrutura</span>
          <h2>Separação de responsabilidades</h2>
          <p>Cada pasta tem uma função clara dentro do projeto.</p>
        </div>

        <div className="features-grid">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </section>

      <section className="section section--highlight" id="proximos-passos">
        <div>
          <span className="eyebrow">Próximos passos</span>
          <h2>Daqui pra frente fica mais simples adicionar novas telas</h2>
          <p>
            Para criar uma nova página, basta adicionar um arquivo em <code>src/pages</code> e importar no
            <code>App.jsx</code>. Quando o projeto tiver várias rotas, você pode evoluir para React Router.
          </p>
        </div>
      </section>
    </>
  )
}

export default Home
