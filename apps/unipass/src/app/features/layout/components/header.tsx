import { LuMoon, LuSun, LuShieldCheck } from 'react-icons/lu'
import { useAppDispatch, useAppSelector } from '../../../shared/hooks/store/store'
import { turnOn, turnOff } from '../../../../store/theme/themeSlice'
import logo from '../../../../../public/favicon.png'

const Header = () => {
  const darkTheme = useAppSelector(state => state.theme.isDark)
  const dispatch = useAppDispatch()


  const toggleTheme = () => {
    darkTheme ? dispatch(turnOff()) : dispatch(turnOn())
  }

  return (
    <header className="w-full h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 bg-[#1A1A24] border-b border-gray-800">

      {/* LEFT — Logo (mobile only) + App name (web only) */}
      <div className="w-full flex justify-center items-center gap-2">
        <div className='w-full flex flex-row sm:hidden justify-center items-center'>
          <div className='flex flex-row sm:hidden gap-2 justify-center items-center'>
            <img src={logo} width={35} alt='Unipass Logo' />
            <span className='font-bold text-3xl text-amber-50'>Unipass</span>
          </div>
        </div>

        <span className="hidden sm:block text-white font-semibold text-xl tracking-wide">
          <div className='flex flex-row gap-4 justify-center items-center'>
            <img src={logo} width={40} alt='Unipass Logo' />
            <span className='font-bold text-3xl'>Unipass</span>
          </div>
        </span>
      </div>

      {/* RIGHT — Theme toggle (web only) */}
      <button
        onClick={toggleTheme}
        className="hidden sm:flex items-center justify-center w-10 h-10 rounded-lg bg-[#2D2D3A] hover:bg-[#3A3A4A] text-gray-300 hover:text-white transition-colors"
        aria-label="Toggle theme"
      >
        {darkTheme ? <LuMoon size={18} /> : <LuSun size={18} />}
      </button>
    </header>
  )
}

export default Header