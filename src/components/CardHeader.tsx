import { useAppStore } from '../store/useAppStore'
import { useTranslations } from '../store/useDerived'

type View = 'simple' | 'advanced' | 'future'

type Props = {
  view: View
  onViewChange: (view: View) => void
}

export const CardHeader = ({ view, onViewChange }: Props) => {
  const lang = useAppStore(s => s.lang)
  const setLang = useAppStore(s => s.setLang)
  const strings = useTranslations()
  return (
    <header className="card-header">
      <div className="card-header-content">
        <div>
          <h1 className="title">{strings.title}</h1>
          <p className="subtitle">{strings.subtitle}</p>
        </div>
        <div className="header-controls">
          <div className="lang-toggle" role="group" aria-label="Language">
            <button
              type="button"
              className={`lang-btn${lang === 'sv' ? ' lang-btn-active' : ''}`}
              onClick={() => setLang('sv')}
            >SV</button>
            <button
              type="button"
              className={`lang-btn${lang === 'en' ? ' lang-btn-active' : ''}`}
              onClick={() => setLang('en')}
            >EN</button>
          </div>
          <div className="view-toggle-group" role="group" aria-label="View">
            <button
              type="button"
              className={`view-toggle-btn${view === 'simple' ? ' view-toggle-btn-active' : ''}`}
              onClick={() => onViewChange('simple')}
            >{strings.viewSimple}</button>
            <button
              type="button"
              className={`view-toggle-btn${view === 'advanced' ? ' view-toggle-btn-active' : ''}`}
              onClick={() => onViewChange('advanced')}
            >{strings.viewForecast}</button>
            <button
              type="button"
              className={`view-toggle-btn${view === 'future' ? ' view-toggle-btn-active' : ''}`}
              onClick={() => onViewChange('future')}
            >{strings.futureTab}</button>
          </div>
        </div>
      </div>
    </header>
  )
}
