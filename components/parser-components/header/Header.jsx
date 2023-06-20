// import BackIcon from '@/icons/BackIcon'
import BackIcon from '../../../assets/icons/BackIcon'


const Header = () => {
  return (
    <div className='flex items-center border-b-2 pb-2 mb-2'>

      <div className='p-2 border rounded-md mr-3'>
        <BackIcon />
      </div>
      <div className='font-bold'>
        Build your audience
      </div>
    </div>
  )
}

export default Header