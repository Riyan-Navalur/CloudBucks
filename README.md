# CloudBucks 🌩️💰

A modern, responsive web application for comparing cloud pricing across AWS, Azure, and Google Cloud Platform (GCP). Built with React, Redux Toolkit, Tailwind CSS, Framer Motion, and Recharts.

![CloudBucks Demo](https://via.placeholder.com/800x400?text=CloudBucks+Demo)

## ✨ Features

- **🔄 Real-time Cost Estimates**: Dynamic pricing calculations as you adjust configurations
- **📊 Interactive Charts**: Beautiful visualizations using Recharts
- **🏆 Best Value Detection**: Automatically highlights the most cost-effective provider
- **📊 Service Breakdown**: Compute, storage, bandwidth, database, disaster recovery, SLA & support
- **⏱️ SLA Configuration**: Uptime requirements (99.0% to 99.999%) and support levels
- **🎯 Tier Plans**: Basic (Free), Enterprise (15% off), Student (50% off) plans with different limits
- **💱 Multi-Currency Support**: USD and INR with automatic conversion
- **📱 Responsive Design**: Mobile-friendly interface with smooth animations
- **🎛️ Service Configuration**: Configure compute, storage, bandwidth, database, and disaster recovery
- **📈 Monthly/Yearly Projections**: Toggle between monthly and annual cost views
- **🔍 Detailed Breakdown**: Service-by-service cost analysis
- **📄 PDF Export**: Generate professional reports and invoices
- **⚡ Smooth Animations**: Enhanced UX with Framer Motion

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with Vite
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Charts**: Recharts
- **PDF Generation**: jsPDF
- **Icons**: Heroicons
- **Language**: JavaScript (ES6+)

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cloud-bucks
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

## 📁 Project Structure

```
cloud-bucks/
├── src/
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── PricingCards.jsx
│   │   │   ├── PricingChart.jsx
│   │   │   ├── ServiceBreakdown.jsx
│   │   │   ├── TimeframeToggle.jsx
│   │   │   └── ViewToggle.jsx
│   │   ├── forms/
│   │   │   ├── ComputeForm.jsx
│   │   │   ├── StorageForm.jsx
│   │   │   ├── BandwidthForm.jsx
│   │   │   ├── DatabaseForm.jsx
│   │   │   └── DisasterRecoveryForm.jsx
│   │   ├── Header.jsx
│   │   ├── ServiceForm.jsx
│   │   ├── ComparisonDashboard.jsx
│   │   └── Footer.jsx
│   ├── store/
│   │   ├── slices/
│   │   │   └── pricingSlice.js
│   │   └── store.js
│   ├── utils/
│   │   └── pricingCalculator.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
└── README.md
```

## 🎮 Usage

### Service Configuration

1. **Plan Selection**: Choose from Basic (Free), Enterprise (15% off), or Student (50% off) plans
2. **Compute**: Select instance types, quantity, and usage hours
3. **Storage**: Configure storage type (SSD/HDD) and amount
4. **Bandwidth**: Set monthly data transfer requirements
5. **Database**: Configure database type, instances, and storage
6. **Disaster Recovery**: Enable/disable backup and disaster recovery features
7. **SLA & Support**: Set uptime requirements (99.0% to 99.999%) and support level

### Viewing Results

- **Overview Cards**: Quick comparison with best value highlighting
- **Interactive Charts**: Visual representation of costs across providers
- **Service Breakdown**: Detailed analysis of each service category including SLA costs
- **Timeframe Toggle**: Switch between monthly and yearly views
- **Currency Toggle**: Switch between USD ($) and INR (₹) with automatic conversion

### PDF Export

- **Cost Report**: Comprehensive comparison report with all providers and configurations
- **Provider Invoice**: Detailed invoice for a specific cloud provider
- **Professional Format**: Branded PDFs with headers, footers, and proper formatting
- **Multi-Currency**: Reports generated in selected currency (USD/INR)
- **Service Details**: Complete breakdown of all configured services

## 💡 How It Works

### Pricing Calculation

The application uses simplified pricing models based on real-world cloud provider pricing:

- **AWS**: Based on EC2, EBS, S3, RDS, and backup services
- **Azure**: Based on Virtual Machines, Storage, Bandwidth, and SQL Database
- **GCP**: Based on Compute Engine, Cloud Storage, and Cloud SQL

### Instance Mapping

The app automatically maps equivalent instance types across providers:
- AWS t3.medium → Azure B2s → GCP e2-medium
- AWS m5.large → Azure D2s_v3 → GCP n1-standard-1

### Currency Conversion

- **Base Currency**: All pricing calculations are done in USD
- **INR Support**: Real-time conversion using approximate exchange rates
- **Exchange Rate**: Currently set at ~₹83.25 per USD (configurable)
- **Formatting**: Proper currency formatting for both USD and INR
- **Charts**: All visualizations automatically update with selected currency

### SLA & Support Pricing

- **Uptime Tiers**: 99.0% (Basic) to 99.999% (Ultra) with increasing cost multipliers
- **Support Levels**: Basic (Free), Business ($80-120/month), Enterprise ($400-600/month)
- **Cost Impact**: Higher SLA requirements increase costs through uptime premiums
- **Provider Differences**: Each provider has different SLA pricing structures

### Tier Plans

CloudBucks offers three service tiers to meet different needs:

#### Basic Plan (Free)
- **Discount**: 0% (Standard pricing)
- **Resource Limits**: 5 instances, 1TB storage, 5TB bandwidth
- **Features**: Basic support, Standard resources, Community access
- **Best For**: Small projects, learning, and development

#### Enterprise Plan (Most Popular)
- **Discount**: 15% off all services
- **Resource Limits**: Unlimited instances, storage, and bandwidth
- **Features**: 24/7 priority support, Dedicated account manager, Premium SLA (99.99%), Advanced security
- **Best For**: Large businesses and production workloads

#### Student Plan
- **Discount**: 50% off all services
- **Resource Limits**: 3 instances, 500GB storage, 2TB bandwidth
- **Features**: Educational support, Learning resources, Standard SLA (99.9%)
- **Requirements**: Valid student ID required
- **Best For**: Students, educators, and academic projects

## ⚠️ Important Disclaimers

- **Estimates Only**: Pricing calculations are approximations for comparison purposes
- **Regional Variations**: Actual costs may vary significantly by region
- **Usage Patterns**: Real-world usage patterns affect final costs
- **Currency Rates**: Exchange rates are approximate and may fluctuate daily
- **Official Pricing**: Always consult official provider documentation for accurate pricing
- **Regular Updates**: Cloud pricing changes frequently; estimates may become outdated

## 🔧 Configuration

### Custom Pricing

To update pricing data, modify the `PRICING_DATA` object in `src/utils/pricingCalculator.js`:

```javascript
const PRICING_DATA = {
  aws: {
    compute: {
      't3.medium': 0.0416, // per hour
      // ... more instance types
    },
    // ... other services
  },
  // ... other providers
};
```

### Adding New Services

1. Update the Redux slice (`src/store/slices/pricingSlice.js`)
2. Add pricing logic (`src/utils/pricingCalculator.js`)
3. Create form component (`src/components/forms/`)
4. Update the dashboard components

## 🎨 Customization

### Styling

The app uses Tailwind CSS with custom color schemes defined in `tailwind.config.js`:

- **Primary**: Blue tones for main UI elements
- **Secondary**: Green tones for success states
- **Accent**: Purple tones for highlights

### Animations

Framer Motion animations can be customized in individual components. Key animation types:

- **Page transitions**: Slide and fade effects
- **Card animations**: Staggered appearances
- **Chart animations**: Progressive data loading

## 📊 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [AWS Pricing Calculator](https://calculator.aws/)
- [Azure Pricing Calculator](https://azure.microsoft.com/en-us/pricing/calculator/)
- [Google Cloud Pricing Calculator](https://cloud.google.com/products/calculator)
- Cloud pricing data from official provider documentation

## 📞 Support

If you have questions or need help:

1. Check the [Issues](https://github.com/your-username/cloud-bucks/issues) page
2. Create a new issue with detailed information
3. Include screenshots if reporting UI issues

---

**Made with ❤️ for cloud enthusiasts**
