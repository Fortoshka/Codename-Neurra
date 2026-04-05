import Link from "next/link";
import { StarsBackground } from "@/components/StarsBackground";
import { WordChanger } from "@/components/WordChanger";

export default function HomePage() {
  return (
    <>
      <StarsBackground />
      <div className="container">
        <header className="header header--viewport">
          <Link href="/login" className="login-btn">
            Личный кабинет <span className="alpha-badge">Alpha</span>
          </Link>
        </header>

        <h1 className="main-title">Neurra</h1>

        <section className="services-section">
          <h2 className="services-title">Услуги</h2>
          <div className="services-grid">
            <div className="service-card">
              <h3 className="service-name">ИИ</h3>
              <p className="service-description">
                Платные подписки на передовые модели
              </p>
              <button type="button" className="order-btn">
                Заказать
              </button>
            </div>
            <div className="service-card in-development">
              <h3 className="service-name">Пополнение счёта</h3>
              <p className="service-description">в разработке</p>
            </div>
          </div>
        </section>

        <section className="why-section">
          <h2 className="why-title">почему мы?</h2>
          <WordChanger />
        </section>

        <footer className="contacts">
          <p className="contacts-title">Служба поддержки</p>
          <div className="contacts-info">
            <p>Email: support_neurra@gmail.com</p>
            <p>
              <a href="#">Telegram</a> | <a href="#">GitHub</a>
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
