import Header from '../../components/parser-components/header/Header'
import Sidebar from '../../components/parser-components/sidebar/Sidebar'
import Mainarea from '../../components/parser-components/mainarea/Mainarea'

export default function Home() {
  return (
    <div className='container shadow-lg m-auto p-3 rounded-lg mt-3 bg-white '>

      <Header />

      <div className='flex'>
        <Sidebar />

        <div className="w-4/6">
          <Mainarea />
        </div>
      </div>

    </div>
  )
}
