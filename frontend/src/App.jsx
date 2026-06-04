import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MahasiswaList from './pages/MahasiswaList';
import MahasiswaForm from './pages/MahasiswaForm';
import PerusahaanList from './pages/PerusahaanList';
import PerusahaanForm from './pages/PerusahaanForm';
import LaporanList from './pages/LaporanList';
import Profile from './pages/Profile';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="mahasiswa" element={<ProtectedRoute roles={['admin']}><MahasiswaList /></ProtectedRoute>} />
            <Route path="mahasiswa/tambah" element={<ProtectedRoute roles={['admin']}><MahasiswaForm /></ProtectedRoute>} />
            <Route path="mahasiswa/edit/:id" element={<ProtectedRoute roles={['admin']}><MahasiswaForm /></ProtectedRoute>} />
            <Route path="perusahaan" element={<ProtectedRoute roles={['admin']}><PerusahaanList /></ProtectedRoute>} />
            <Route path="perusahaan/tambah" element={<ProtectedRoute roles={['admin']}><PerusahaanForm /></ProtectedRoute>} />
            <Route path="perusahaan/edit/:id" element={<ProtectedRoute roles={['admin']}><PerusahaanForm /></ProtectedRoute>} />
            <Route path="laporan" element={<LaporanList />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;