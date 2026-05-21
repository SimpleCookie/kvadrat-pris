import { type Lang, type T } from '../lib/i18n'

type View = 'simple' | 'advanced' | 'future'

type Props = {
  lang: Lang
  view: View
  t: T
  onLangChange: (lang: Lang) => void
  onViewChange: (view: View) => void
}

export const CardHeader = ({ lang, view, t, onLangChange, onViewChange }: Props) => (
  <header className="card-header">
    <div className="card-header-content">
      <div>
        <h1 className="title">{t.title}</h1>
        <p className="subtitle">{t.subtitle}</p>
      </div>
      <div className="header-controls">
        <div className="lang-toggle" role="group" aria-label="Language">
          <button
            type="button"
            className={`lang-btn${lang === 'sv' ? ' lang-btn-active' : ''}`}
            onClick={() => onLangChange('sv')}
          >SV</button>
          <button
            type="button"
            className={`lang-btn${lang === 'en' ? ' lang-btn-active' : ''}`}
            onClick={() => onLangChange('en')}
          >EN</button>
        </div>
        <div className="view-toggle-group" role="group" aria-label="View">
          <button
            type="button"
            className={`view-toggle-btn${view === 'simple' ? ' view-toggle-btn-active' : ''}`}
            onClick={() => onViewChange('simple')}
          >{t.viewSimple}</button>
          <button
            type="button"
            className={`view-toggle-btn${view === 'advanced' ? ' view-toggle-btn-active' : ''}`}
            onClick={() => onViewChange('advanced')}
          >{t.viewForecast}</button>
          <button
            type="button"
            className={`view-toggle-btn${view === 'future' ? ' view-toggle-btn-active' : ''}`}
            onClick={() => onViewChange('future')}
          >{t.futureTab}</button>
        </div>
      </div>
    </div>
  </header>
)
