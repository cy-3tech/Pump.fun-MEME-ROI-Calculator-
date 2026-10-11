function toggleDarkMode() {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  document.getElementById('sunIcon').style.display = isDark ? 'block' : 'none';
  document.getElementById('moonIcon').style.display = isDark ? 'none' : 'block';
}

function initCitationSystem() {
  let i = 1, map = new Map();
  document.querySelectorAll('[data-ref]').forEach(el => {
    if (el.dataset.citationProcessed) return;
    const raw = (el.getAttribute('data-ref')||'').trim();
    if (!raw) return;

    const parts = raw.split('|');
    const url = parts[0].trim();
    const idx = (parts[1]||'').trim() || map.get(raw) || (map.set(raw, String(i)), String(i++));

    if (!el.textContent || !el.textContent.trim()) { el.dataset.citationProcessed = 'true'; return; }

    const btn = document.createElement('sup'); btn.textContent = String(idx);
    Object.assign(btn.style, { fontSize:'8px', color:'#fff', cursor:'pointer', top: '1px', fontWeight:'bold', backgroundColor:'#0284c7', borderRadius:'50%', transition:'all .15s', userSelect:'none', minWidth:'19px', height:'19px', marginLeft:'6px', display:'inline-flex', alignItems:'center', justifyContent:'center', boxShadow:'0 1px 3px rgba(0,0,0,.2)', lineHeight:'1'});
    btn.addEventListener('mouseenter', ()=> Object.assign(btn.style, { backgroundColor:'#0369a1', transform:'scale(1.12)' }));
    btn.addEventListener('mouseleave', ()=> Object.assign(btn.style, { backgroundColor:'#0284c7', transform:'scale(1)' }));
    btn.addEventListener('click', e=>{ e.preventDefault(); e.stopPropagation(); window.open(url, '_blank'); });

    el.appendChild(btn); el.dataset.citationProcessed = 'true';
  });
}

function calculatorApp() {
  return {
    // State variables
    mode: 'basic',
    showAdvanced: false,
    
    // Basic inputs
    initialInvestment: 1,
    currentMarketCap: 5000,
    targetMarketCap: 2000000,
    
    // Advanced inputs
    totalSupply: 1000000000,
    circulatingSupply: 500000000,
    demandGrowth: 50,
    liquidityPool: 100000,
    
    // Calculated results
    finalValue: 0,
    returnMultiple: 0,
    totalProfit: 0,
    roiPercentage: 0,
    
    // Advanced results
    currentPrice: 0,
    targetPrice: 0,
    tokensOwned: 0,
    ownershipPercentage: 0,
    estimatedSlippage: 0,
    
    // 1000x predictions
    requiredMarketCap1000x: 0,
    holdersNeeded: 0,
    avgInvestmentNeeded: 0,
    feasibilityScore: 0,
    
    // Initialize
    init() {
      this.calculateReturns();
    },
    
    // Main calculation function
    calculateReturns() {
      // Basic calculations
      if (this.currentMarketCap > 0 && this.targetMarketCap > 0) {
        this.returnMultiple = this.targetMarketCap / this.currentMarketCap;
        this.finalValue = this.initialInvestment * this.returnMultiple;
        this.totalProfit = this.finalValue - this.initialInvestment;
        this.roiPercentage = ((this.finalValue - this.initialInvestment) / this.initialInvestment) * 100;
      }
      
      // Advanced calculations
      if (this.mode === 'advanced' && this.totalSupply > 0 && this.circulatingSupply > 0) {
        this.currentPrice = this.currentMarketCap / this.circulatingSupply;
        this.targetPrice = this.targetMarketCap / this.circulatingSupply;
        this.tokensOwned = this.initialInvestment / this.currentPrice;
        this.ownershipPercentage = (this.tokensOwned / this.circulatingSupply) * 100;
        
        // Estimate slippage based on liquidity pool
        if (this.liquidityPool > 0) {
          const tradeSize = this.finalValue;
          this.estimatedSlippage = Math.min((tradeSize / this.liquidityPool) * 100, 100);
        }
      }
      
      // 1000x predictions
      this.requiredMarketCap1000x = this.currentMarketCap * 1000;
      
      // Estimate holders needed (assuming average investment of $1000)
      const avgInvestment = 1000;
      this.holdersNeeded = Math.ceil(this.requiredMarketCap1000x / avgInvestment);
      this.avgInvestmentNeeded = avgInvestment;
      
      // Feasibility score (0-100%)
      this.feasibilityScore = this.calculateFeasibility();
    },
    
    // Calculate feasibility score
    calculateFeasibility() {
      let score = 50; // Base score
      
      // Adjust based on market cap size
      if (this.currentMarketCap < 1000000) score += 20; // Small caps have more room
      else if (this.currentMarketCap > 1000000000) score -= 30; // Large caps harder to grow 1000x
      
      // Adjust based on target
      if (this.requiredMarketCap1000x < 10000000000) score += 15; // Under $10B is more feasible
      else if (this.requiredMarketCap1000x > 100000000000) score -= 25; // Over $100B is very difficult
      
      // Clamp between 0-100
      return Math.max(0, Math.min(100, score));
    },
    
    // Format numbers for display
    formatNumber(num) {
      if (num >= 1000000000) {
        return (num / 1000000000).toFixed(2) + 'B';
      } else if (num >= 1000000) {
        return (num / 1000000).toFixed(2) + 'M';
      } else if (num >= 1000) {
        return (num / 1000).toFixed(2) + 'K';
      }
      return num.toFixed(2);
    },
    
    // Load example scenarios
    loadExample(exampleNum) {
      switch(exampleNum) {
        case 1: // Pump.fun example
          this.initialInvestment = 1;
          this.currentMarketCap = 5000;
          this.targetMarketCap = 2000000;
          break;
        case 2: // Mid-cap growth
          this.initialInvestment = 100;
          this.currentMarketCap = 1000000;
          this.targetMarketCap = 100000000;
          break;
        case 3: // Large cap scenario
          this.initialInvestment = 1000;
          this.currentMarketCap = 100000000;
          this.targetMarketCap = 1000000000;
          break;
      }
      this.calculateReturns();
    },
    
    // Scroll to calculator
    scrollToCalculator() {
      document.getElementById('calculator').scrollIntoView({ behavior: 'smooth' });
    }
  }
}

document.addEventListener('DOMContentLoaded', function() {
  // Initialize AOS
  AOS.init({
    duration: 800,
    once: true,
    offset: 100
  });

  // Initialize Lucide icons
  lucide.createIcons();

  // Initialize Preline components
  setTimeout(() => {
    HSStaticMethods.autoInit();
  }, 100);

  // Progress bar functionality
  const progressBar = document.getElementById('progressBar');
  
  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    
    progressBar.style.width = scrollPercent + '%';
  });

  // Initialize citation system
  initCitationSystem();
});

