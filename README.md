# E-Commerce Frontend Application

A modern, responsive e-commerce frontend application built with Next.js and GraphQL, designed to provide an exceptional online shopping experience.

## 🚀 Project Overview

This E-Commerce Frontend is a comprehensive web application that serves as the client-side interface for an online marketplace. The application is built using cutting-edge technologies to ensure optimal performance, scalability, and user experience.

### Key Features

- **🛍️ Product Catalog**: Browse and search through extensive product listings
- **🛒 Shopping Cart**: Add, remove, and manage items in your cart
- **👤 User Authentication**: Secure user registration and login system
- **💳 Checkout Process**: Streamlined purchasing workflow
- **📱 Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **🔍 Advanced Search**: Filter and sort products by various criteria
- **⭐ Product Reviews**: Read and write product reviews
- **📦 Order Management**: Track order status and history
- **💰 Payment Integration**: Secure payment processing
- **🎨 Modern UI/UX**: Clean, intuitive interface design

## 🛠️ Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) - React framework for production
- **Language**: TypeScript/JavaScript
- **Styling**: CSS Modules / Styled Components / Tailwind CSS
- **State Management**: React Context / Redux Toolkit
- **API Integration**: GraphQL with Apollo Client
- **Authentication**: JWT / OAuth
- **Build Tool**: Webpack (via Next.js)
- **Package Manager**: npm / yarn
- **Version Control**: Git

## 📋 Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js** (version 16.0 or higher)
- **npm** (version 8.0 or higher) or **yarn**
- **Git** for version control
- A modern web browser (Chrome, Firefox, Safari, Edge)

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd E-Commerce-FE
```

### 2. Install Dependencies

```bash
# Using npm
npm install

# Or using yarn
yarn install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory and configure the following variables:

```bash
# GraphQL API Configuration
NEXT_PUBLIC_GRAPHQL_API_URL=http://20.11.66.22:8000/graphql

# Development API (for local testing)
NEXT_PUBLIC_GRAPHQL_API_URL_XX=http://127.0.0.1:8000/graphql

# Additional environment variables (add as needed)
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_KEY=your_api_key_here
```

### 4. Start Development Server

```bash
# Using npm
npm run dev

# Or using yarn
yarn dev
```

The application will be available at `http://localhost:3000`

## 🌐 API Configuration

### GraphQL Endpoints

The application connects to a GraphQL API backend with the following configuration:

- **Production API**: `http://20.11.66.22:8000/graphql`
- **Local Development API**: `http://127.0.0.1:8000/graphql`

### API Features

- Real-time data fetching
- Optimistic updates
- Caching strategies
- Error handling
- Authentication integration

## 📁 Project Structure

```
E-Commerce-FE/
├── components/          # Reusable UI components
│   ├── common/         # Common components (Header, Footer, etc.)
│   ├── product/        # Product-related components
│   ├── cart/           # Shopping cart components
│   └── user/           # User authentication components
├── pages/              # Next.js pages
│   ├── api/           # API routes
│   ├── products/      # Product pages
│   ├── cart/          # Cart page
│   └── checkout/      # Checkout pages
├── styles/            # Global styles and CSS modules
├── utils/             # Utility functions
├── hooks/             # Custom React hooks
├── contexts/          # React contexts
├── graphql/           # GraphQL queries and mutations
├── types/             # TypeScript type definitions
├── public/            # Static assets
└── config/            # Configuration files
```

## 🚀 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run test` - Run tests

## 🎯 Usage

### Development Workflow

1. **Start the development server** using `npm run dev`
2. **Make changes** to the codebase
3. **Test features** in the browser
4. **Run linting** with `npm run lint`
5. **Build for production** using `npm run build`

### Key Pages

- **Home Page** (`/`) - Product showcase and navigation
- **Product Listing** (`/products`) - Browse all products
- **Product Detail** (`/products/[id]`) - Individual product information
- **Shopping Cart** (`/cart`) - Review selected items
- **Checkout** (`/checkout`) - Complete purchase
- **User Profile** (`/profile`) - Manage account settings

## 🔐 Authentication

The application supports:

- User registration and login
- JWT token-based authentication
- Protected routes for authenticated users
- Password reset functionality
- Social media login integration

## 📱 Responsive Design

The application is fully responsive and optimized for:

- **Desktop** (1200px and above)
- **Tablet** (768px - 1199px)
- **Mobile** (320px - 767px)

## 🧪 Testing

Testing strategy includes:

- Unit tests for components
- Integration tests for API calls
- End-to-end testing for user workflows
- Performance testing

## 🚀 Deployment

### Production Build

```bash
npm run build
npm run start
```

### Deployment Platforms

The application can be deployed on:

- **Vercel** (recommended for Next.js)
- **Netlify**
- **AWS Amplify**
- **Heroku**
- **Digital Ocean**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Project Lead**: [Your Name]
- **Frontend Developers**: [Team Members]
- **UI/UX Designers**: [Design Team]
- **Backend Integration**: [Backend Team]

## 📞 Support

For support and questions:

- **Email**: support@yourproject.com
- **Documentation**: [Project Wiki]
- **Issues**: [GitHub Issues]

## 🔄 Version History

- **v1.0.0** - Initial release
- **v1.1.0** - Added user authentication
- **v1.2.0** - Enhanced shopping cart functionality
- **v2.0.0** - Complete UI/UX redesign

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- GraphQL community for excellent tooling
- 
- Open source contributors
- UI/UX inspiration from modern e-commerce platforms
---
**Note**: This project is part of the JTBR project series developed at Ho Chi Minh City University of Education.

Trigger application