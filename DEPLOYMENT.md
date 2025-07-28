# 🚀 Website Deployment Guide

## 📋 **Quick Deployment Options**

### **Option 1: Railway (Recommended - Free)**
1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Railway will automatically detect and deploy your app
6. Get your live URL instantly!

### **Option 2: Render (Free)**
1. Go to https://render.com
2. Sign up and connect GitHub
3. Click "New Web Service"
4. Select your repository
5. Set build command: `npm run install-all && npm run build`
6. Set start command: `npm start`
7. Deploy!

### **Option 3: Vercel (Frontend Only)**
1. Go to https://vercel.com
2. Sign up and connect GitHub
3. Import your repository
4. Set build command: `cd frontend && npm install && npm run build`
5. Deploy!

## 🔧 **Local Testing Before Deployment**

### **Test Database Server:**
```cmd
cd "C:\Users\Bin Khamis\store-website\backend"
node databaseServer.js
```

### **Test Frontend:**
```cmd
cd "C:\Users\Bin Khamis\store-website\frontend"
npm start
```

## 🌐 **Environment Variables**

### **For Railway/Render:**
- `PORT`: Automatically set by platform
- `REACT_APP_API_URL`: Your backend URL (e.g., `https://your-app.railway.app`)

### **For Vercel:**
- `REACT_APP_API_URL`: Your backend URL

## 📁 **File Structure for Deployment**
```
store-website/
├── package.json          # Root package.json
├── Procfile             # For Heroku
├── backend/
│   ├── databaseServer.js
│   ├── database.js
│   └── store.db         # SQLite database
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
└── DEPLOYMENT.md        # This file
```

## 🔑 **Default Admin Account**
- **Email:** `admin@store.com`
- **Password:** `admin123`

## 📊 **Database Features**
- ✅ **Permanent Storage**: All data saved in SQLite
- ✅ **User Management**: Customer registration and admin accounts
- ✅ **Product Management**: Products with discounts
- ✅ **Order Management**: Complete order tracking
- ✅ **Bank Details**: Customer payment information

## 🛠️ **Troubleshooting**

### **If deployment fails:**
1. Check if all dependencies are in `package.json`
2. Ensure `npm start` works locally
3. Check platform logs for errors
4. Verify environment variables are set

### **If database doesn't work:**
1. Ensure SQLite is supported by your platform
2. Check if database file is being created
3. Verify file permissions

## 🌍 **Live Demo Features**
Once deployed, your website will have:
- ✅ **Customer Registration**: Users can create accounts
- ✅ **Product Browsing**: View products with discounts
- ✅ **Shopping Cart**: Add/remove items
- ✅ **Order Placement**: Complete checkout process
- ✅ **Admin Dashboard**: Manage products and orders
- ✅ **Bank Details**: Payment confirmation system
- ✅ **Order Tracking**: View order status

## 📞 **Support**
If you encounter issues:
1. Check the platform's documentation
2. Review error logs in the platform dashboard
3. Test locally first to ensure everything works

## 🎯 **Next Steps After Deployment**
1. **Customize**: Update product images and descriptions
2. **Configure**: Set up your bank account details
3. **Test**: Register customers and place test orders
4. **Monitor**: Check admin dashboard for orders
5. **Scale**: Add more products and features

---

**Your website is now ready for deployment! 🚀** 