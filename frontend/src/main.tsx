import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import Routing from './App.tsx'
import { Provider } from 'react-redux'
import store from './utils/redux/store/store.tsx'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/ReactToastify.css'


ReactDOM.createRoot(document.getElementById('root')!).render(

  <Provider store={store}>
    <BrowserRouter>
      <Routing />
      <ToastContainer />
    </BrowserRouter>
  </Provider>

)
