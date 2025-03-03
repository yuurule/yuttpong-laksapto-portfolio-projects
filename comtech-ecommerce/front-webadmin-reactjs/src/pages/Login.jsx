import styles from '../css/Login.module.scss';
import Form from 'react-bootstrap/Form';

export default function Login() {

  const handlerSubmit = (e) => {
    e.preventDefault();
    console.log("Sign in");
  }

  return (
    <div className={`${styles.loginPage}`}>
      
      <div className='card'>
        <div className='card-body p-5'>
          <header className='text-center'>
            <h1 className='h5'>COMTECH WEBADMIN SYSTEM</h1>
            <p>Plese sign in</p>
          </header>
          <Form onSubmit={handlerSubmit}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="username@example.com" />
            </Form.Group>
            <Form.Group className="mb-4" controlId="exampleForm.ControlInput1">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" />
            </Form.Group>
            <button 
              type="submit" 
              className='btn btn-primary w-100'
            >
              Sign in
            </button>
          </Form>
        </div>
      </div>

    </div>
  )
}