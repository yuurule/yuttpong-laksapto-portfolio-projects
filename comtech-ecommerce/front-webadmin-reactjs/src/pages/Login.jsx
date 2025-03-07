import styles from '../css/Login.module.scss';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/actions/authAction';
import { useNavigate } from 'react-router-dom';

// กำหนด schema สำหรับ validation ด้วย Zod
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

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data) => {
    // try {
    //   // จำลองการส่งข้อมูลไปยัง API (ในโปรเจคจริงควรเรียกใช้ API จริง)
    //   console.log('ข้อมูลที่ส่ง:', data);
      
    //   // จำลองการรอการตอบกลับจาก API
    //   // await new Promise(resolve => setTimeout(resolve, 1000));
      
    //   // alert('เข้าสู่ระบบสำเร็จ!');
    // } catch (error) {
    //   console.error('เกิดข้อผิดพลาดในการเข้าสู่ระบบ:', error);
    //   alert('เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
    // }

    const { email, password } = data;

    try {
      await dispatch(login(email, password));
      navigate('/');
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการเข้าสู่ระบบ:', error);
    }
  };

  return (
    <div className={`${styles.loginPage}`}>
      
      <div className='card'>
        <div className='card-body p-5'>
          <header className='text-center'>
            <h1 className='h5'>COMTECH WEBADMIN SYSTEM</h1>
            <p>Plese log in</p>
          </header>
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group mb-3">
              <label htmlFor="email" className='form-label'>อีเมล</label>
              <input
                id="email"
                type="email"
                {...register('email')}
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              />
              {errors.email && <small className="invalid-feedback">{errors.email.message}</small>}
            </div>

            <div className="form-group mb-3">
              <label htmlFor="password" className='form-label'>รหัสผ่าน</label>
              <input
                id="password"
                type="password"
                {...register('password')}
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              />
              {errors.password && <small className="invalid-feedback">{errors.password.message}</small>}
            </div>

            <button type="submit" disabled={isSubmitting} className='btn btn-success w-100'>
              {isSubmitting ? 'กำลังดำเนินการ...' : 'เข้าสู่ระบบ'}
            </button>
          </form>

        </div>
      </div>

    </div>
  )
}