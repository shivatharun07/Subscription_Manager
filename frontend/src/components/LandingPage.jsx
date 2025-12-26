import React from 'react';
import { Rocket, PieChart, Bell, ListMusic } from './Icons';

export function LandingPage({ onLogin, onRegister }) {
    return (
        <div className="landing-container">
            <nav className="landing-nav">
                <div className="logo-section">
                    <Rocket size={24} color="#6366f1" />
                    <h1>Subminder</h1>
                </div>
                <div className="nav-actions">
                    <button onClick={onLogin} className="btn btn-secondary">Log In</button>
                    <button onClick={onRegister} className="btn btn-primary">Get Started</button>
                </div>
            </nav>

            <main className="landing-hero fade-in">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Take Control of Your <br />
                        <span className="gradient-text">Subscription Life</span>
                    </h1>
                    <p className="hero-subtitle">
                        Stop losing money on forgotten free trials. Track, manage, and optimize all your subscriptions in one beautiful dashboard.
                    </p>
                    <div className="hero-cta">
                        <button onClick={onRegister} className="btn btn-lg btn-primary pulse-animation">Start Tracking Free</button>
                    </div>

                    <div className="features-grid">
                        <div className="feature-item fade-in" style={{ animationDelay: '0.4s' }}>
                            <div className="feature-icon"><ListMusic color="#6366f1" /></div>
                            <span>Track Everything</span>
                        </div>
                        <div className="feature-item fade-in" style={{ animationDelay: '0.5s' }}>
                            <div className="feature-icon"><PieChart color="#22c55e" /></div>
                            <span>Visualize Spend</span>
                        </div>
                        <div className="feature-item fade-in" style={{ animationDelay: '0.6s' }}>
                            <div className="feature-icon"><Bell color="#f59e0b" /></div>
                            <span>Get Reminders</span>
                        </div>
                    </div>
                </div>

                <div className="hero-visual">
                    <div className="mock-dashboard">
                        <div className="mock-header">
                            <div className="mock-dot red"></div>
                            <div className="mock-dot yellow"></div>
                            <div className="mock-dot green"></div>
                        </div>
                        <div className="mock-body">
                            <div className="mock-stat-row">
                                <div className="mock-stat">
                                    <span className="label">Total Monthly</span>
                                    <span className="value">₹2,499</span>
                                </div>
                                <div className="mock-stat">
                                    <span className="label">Active Subs</span>
                                    <span className="value">8</span>
                                </div>
                            </div>

                            <div className="graph-container">
                                <div className="graph-header">
                                    <span>Spending Trend</span>
                                </div>
                                <div className="bar-chart">
                                    <div className="bar" style={{ '--height': '40%' }}></div>
                                    <div className="bar" style={{ '--height': '65%' }}></div>
                                    <div className="bar" style={{ '--height': '55%' }}></div>
                                    <div className="bar active" style={{ '--height': '85%' }}></div>
                                    <div className="bar" style={{ '--height': '60%' }}></div>
                                </div>
                            </div>

                            <div className="mock-list">
                                <div className="mock-item">
                                    <div className="mock-icon" style={{ background: '#E50914' }}>N</div>
                                    <div className="mock-details">
                                        <span className="name">Netflix</span>
                                        <span className="date">Renews in 2 days</span>
                                    </div>
                                    <span className="cost">₹649</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="floating-badge badge-1">
                        <span>✨ Saved ₹4,200 this year</span>
                    </div>
                </div>
            </main>

            <section className="benefits-section fade-in" style={{ animationDelay: '0.2s' }}>
                <h2 className="section-heading">Why choose Subminder?</h2>
                <div className="benefit-cards">
                    <div className="benefit-card">
                        <div className="card-icon">🔔</div>
                        <h3>Never Miss a Renewal</h3>
                        <p>Get notified before you get charged. Say goodbye to surprise credit card bills.</p>
                    </div>
                    <div className="benefit-card">
                        <div className="card-icon">📊</div>
                        <h3>Track Your Spending</h3>
                        <p>Visualize where your money goes with beautiful charts and category breakdowns.</p>
                    </div>
                    <div className="benefit-card">
                        <div className="card-icon">🎯</div>
                        <h3>Optimize Costs</h3>
                        <p>Identify unused subscriptions and cancel them easily. Save money instantly.</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
