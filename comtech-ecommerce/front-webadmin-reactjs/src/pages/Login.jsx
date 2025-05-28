import { useState } from 'react';
import styles from '../css/Login.module.scss';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch } from 'react-redux';
import { login } from '../redux/actions/authAction';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faKey } from '@fortawesome/free-solid-svg-icons';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'กรุณากรอกอีเมล' })
    .email({ message: 'รูปแบบอีเมลไม่ถูกต้อง' }),
  password: z
    .string()
    .min(1, { message: 'กรุณากรอกรหัสผ่าน' })
    .min(4, { message: 'รหัสผ่านต้องมีอย่างน้อย 4 ตัวอักษร' })
});

export default function Login() {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data) => {
    const { email, password } = data;
    setError(null);

    try {
      await dispatch(login(email, password));
      navigate('/');
    } catch (error) {
      setError('Your credential is not correct')
      console.error('เกิดข้อผิดพลาดในการเข้าสู่ระบบ:', error);
    }
  };

  const handleLoginWithGuestMode = async () => {
    try {
      await dispatch(login('guest@example.com', 'guest123'));
      navigate('/');
    } catch (error) {
      setError('Your credential is not correct')
      console.error('เกิดข้อผิดพลาดในการเข้าสู่ระบบ:', error);
    }
  }

  return (
    <div className={`${styles.loginPage}`}>
      
      <div className={`card ${styles.loginCard}`}>
        <img 
          src={'/images/gradient-fog-heading.png'} 
          className={`${styles.bgFog}`}
        />
        <div className={`card-body ${styles.loginBody}`}>
          <header className='text-center mb-5'>
            <h1>COMTECH <strong className={`${styles.titleColour}`}>E-COMMERCE</strong><br />WEBADMIN</h1>
            <p>Enter your credential to log in</p>
          </header>

          {
            (error !== null && error !== '') &&
            <p className='alert alert-danger'>{error}</p>
          }
          
          <form onSubmit={handleSubmit(onSubmit)} className='px-5'>
            <div className="form-group mb-4 position-relative">
              <FontAwesomeIcon icon={faUser} className={`${styles.formIcon}`} />
              <input
                id="email"
                type="email"
                {...register('email')}
                placeholder='Email'
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              />
              {errors.email && <small className="invalid-feedback">{errors.email.message}</small>}
            </div>

            <div className="form-group mb-4 position-relative">
              <FontAwesomeIcon icon={faKey} className={`${styles.formIcon}`} />
              <input
                id="password"
                type="password"
                {...register('password')}
                placeholder='Password'
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              />
              {errors.password && <small className="invalid-feedback">{errors.password.message}</small>}
            </div>

            <button type="submit" disabled={isSubmitting} className={`btn ${styles.loginBtn} mb-3`}>
              {isSubmitting ? 'กำลังดำเนินการ...' : 'เข้าสู่ระบบ'}
            </button>
            <button 
              type="button" 
              className={`btn ${styles.loginBtn}`}
              onClick={handleLoginWithGuestMode}
            >
              เข้าสู่ระบบด้วยโหมดผู้เยี่ยมชม
            </button>
          </form>

        </div>
      </div>

    </div>
  )
}