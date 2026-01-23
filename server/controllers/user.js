const { comparePassword } = require('../helpers/bcrypt');
const { User } = require('../models');
const { signToken } = require('../helpers/jwt');

class UserController {
    static async register(req, res, next) {
        try {
            const { username, email, password } = req.body;

            const newUser = await User.create({ 
                username, 
                email, 
                password 
            });

            res.status(201).json({ 
                message: "User created successfully",
                user: {
                    id: newUser.id,
                    username: newUser.username,
                    email: newUser.email
                }
            });
        } catch (error) {
            next(error);
        }
    }

    static async login (req, res, next) {
        try {
            const { email, password } = req.body;

            if (!email) {
                throw { name: 'BadRequest', message: 'Email is required' };
            }

            if (!password) {
                throw { name: 'BadRequest', message: 'Password is required' };
            }


            const user = await User.findOne({ where: { email } });

            if (!user)
                throw { name: 'Unauthorized', message: 'Invalid email or password' };

            const isPasswordValid = comparePassword(password, user.password);
            if (!isPasswordValid)
                throw { name: 'Unauthorized', message: 'Invalid email or password' };

            const accessToken = signToken({ id: user.id, email: user.email });

            res.status(200).json({ accessToken })
        } catch (error) {
            console.log(error);
            next(error);
            
        }
    }


    static async showProfile(req, res, next) {
        try {
          // req.user.id didapat dari middleware authentication
          const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] }
          });
    
          if (!user) throw { name: 'NotFound', message: 'User not found' };
    
          res.status(200).json(user);
        } catch (error) {
          next(error);
        }
      }



      static async updateProfile(req, res, next) {
        try {
            const { username, email, gender, age } = req.body;
    
            const user = await User.findByPk(req.user.id);
            if (!user) throw { name: 'NotFound', message: 'User not found' };
    
            await user.update({ 
                username, 
                email, 
                gender, 
                age 
            });
    
            res.status(200).json({ 
                message: "Profile updated successfully",
                user: {
                    username: user.username,
                    email: user.email,
                    gender: user.gender,
                    age: user.age
                }
            });
        } catch (error) {
            next(error);
        }
    }


}

  

module.exports = UserController;

// tolong bantu saya mengerjakan frontend menggunakan Vite + React.js (Implementasi Component, Router, State Management: Redux (Jangan menggunakan Thunk Async)),
// Wajib Implementasi state management redux pada sisi clientInformation, pastikan fetching data melalui store dan mendistribusikannya ke component yang membutuhkan (Single source of truth), Wajib, membuat form login menggunakakn sosial media sign in (google), dan manfaatkan 3rd party API yang saya gunakan.

// NutriGuide AI adalah asisten kesehatan digital berbasis web yang dirancang untuk memberikan solusi perencanaan makan personal (Meal Planning) bagi individu yang memiliki target berat badan spesifik, baik itu menurunkan berat badan (Lose Weight) maupun menaikkan berat badan (Gain Weight). Aplikasi ini mengintegrasikan data nutrisi akurat dengan kecerdasan buatan untuk memastikan setiap kalori yang dikonsumsi mendukung target kesehatan pengguna.

// 2.⁠ ⁠Masalah yang Diselesaikan
// Banyak orang gagal dalam diet karena tidak tahu berapa banyak kalori yang harus dikonsumsi dan bingung mencari resep yang sesuai dengan kebutuhan nutrisi tersebut. NutriGuide AI memotong kebingungan tersebut dengan memberikan rekomendasi instan dan jadwal makan yang terukur.

// 3.⁠ ⁠Fitur Utama (Core Features)
// AI Goal Consultant (Kriteria a.iii): Menggunakan Gemini AI untuk menganalisis profil fisik user (berat, tinggi, usia) dan menentukan strategi kalori harian yang optimal untuk mencapai target berat badan.

// Calorie-Targeted Recipes: Integrasi dengan Spoonacular API untuk menyajikan resep yang sudah terfilter berdasarkan jumlah kalori, protein, dan lemak yang dibutuhkan.

// Smart Meal Planner: Fitur penjadwalan makan (Sarapan, Siang, Malam) yang memastikan total asupan harian tidak melebihi atau kurang dari target yang ditentukan.

// Visual Appetite (Unsplash Integration): Menampilkan visualisasi makanan yang berkualitas tinggi untuk meningkatkan motivasi user dalam menjalankan program dietnya.

// Personal Recipe Vault (Favorites): Memungkinkan user menyimpan resep-resep diet yang paling mereka sukai untuk diakses kembali dengan cepat.

// 4.⁠ ⁠Arsitektur Teknologi (Tech Stack)
// Frontend: React JS (untuk antarmuka yang reaktif dan dinamis).

// Backend: Node.js & Express JS (untuk manajemen logika API dan database).

// Database: PostgreSQL/MySQL dengan Sequelize ORM (untuk menyimpan profil user, resep, dan jadwal makan secara terstruktur).

// 3rd Party APIs:

// Gemini AI: Otak di balik analisis strategi diet.

// Spoonacular: Sumber data nutrisi dan resep masakan dunia.

// Unsplash: Sumber aset gambar estetis untuk antarmuka pengguna.

// 5.⁠ ⁠Alur Pengguna (User Journey)
// Input Profile: User memasukkan data fisik dan memilih target (Naik/Turun berat badan).

// Get Strategy: AI memberikan rekomendasi asupan kalori harian.

// Explore & Plan: User mencari resep yang sesuai kalori dan memasukkannya ke jadwal (Meal Plan).

// Track: User memantau jadwal makan mereka setiap hari melalui dashboard.

