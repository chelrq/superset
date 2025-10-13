# Apache Superset - Core Use Cases and User Journeys

## Overview

Apache Superset is a modern, enterprise-ready business intelligence (BI) web application that enables data exploration, visualization, and dashboarding. This document outlines the primary use cases and typical user journeys for developers onboarding to the codebase.

---

## Core Use Cases (Ordered by Priority)

### 1. Creating and Viewing Interactive Dashboards

**Description:** Users compose multiple visualizations into interactive dashboards with filters, tabs, and layouts to monitor business metrics and KPIs.

**Key Components:**
- Backend: `superset/dashboards/` - Dashboard API and business logic
- Frontend: `superset-frontend/src/dashboard/` - Dashboard builder and viewer
- Models: `superset/models/core.py` - Dashboard model

**Features:**
- Drag-and-drop dashboard builder
- Cross-filtering between charts
- Native filters for dashboard-wide filtering
- Scheduled PDF/email exports
- Embedded dashboard support
- Real-time auto-refresh capabilities

---

### 2. Exploring Data and Building Visualizations (Explore View)

**Description:** Users create charts and visualizations through a no-code interface by selecting datasets, metrics, dimensions, and chart types.

**Key Components:**
- Backend: `superset/charts/` - Chart/slice API and logic
- Frontend: `superset-frontend/src/explore/` - Explore view UI
- Plugins: `superset-frontend/plugins/` - Visualization plugins (50+ chart types)

**Features:**
- No-code chart builder with control panels
- 50+ visualization types (bar, line, pie, maps, heatmaps, etc.)
- Support for custom SQL and Jinja templating
- Query result caching
- Drill-down and drill-to-detail capabilities
- Export to CSV/JSON

---

### 3. Writing and Executing SQL Queries (SQL Lab)

**Description:** Power users and analysts write, execute, and share SQL queries through an interactive SQL editor with syntax highlighting and autocomplete.

**Key Components:**
- Backend: `superset/sql_lab.py`, `superset/sqllab/` - SQL Lab functionality
- Frontend: `superset-frontend/src/SqlLab/` - SQL Editor UI
- Views: `superset/views/sql_lab.py` - SQL Lab views

**Features:**
- Multi-tab SQL editor with syntax highlighting
- Query history and saved queries
- Database schema browser with table/column exploration
- Query result visualization
- CSV export with configurable row limits
- Async query execution for long-running queries
- Cost estimation (for supported databases)
- Creating datasets from query results

---

### 4. Managing Data Connections and Datasets

**Description:** Administrators and data engineers configure database connections and define datasets (physical tables or virtual SQL-based datasets) that serve as data sources for visualizations.

**Key Components:**
- Backend: `superset/databases/` - Database connection management
- Backend: `superset/datasets/` - Dataset API and logic
- Backend: `superset/db_engine_specs/` - Database-specific implementations (50+ databases)
- Frontend: `superset-frontend/src/features/databases/` - Database management UI

**Features:**
- 50+ database connectors (PostgreSQL, MySQL, BigQuery, Snowflake, Redshift, etc.)
- Physical datasets (tables/views)
- Virtual datasets (SQL-based)
- Column metadata and type configuration
- Metrics and calculated columns via SQL expressions
- Dataset-level caching configuration
- SSH tunneling for secure connections

---

### 5. Scheduling Reports and Alerts

**Description:** Users configure scheduled reports (dashboard/chart snapshots sent via email or Slack) and alerts based on data thresholds.

**Key Components:**
- Backend: `superset/reports/` - Reports and alerts API
- Backend: `superset/tasks/` - Celery background tasks
- Frontend: `superset-frontend/src/features/reports/` - Reports UI

**Features:**
- Scheduled email reports with dashboard/chart screenshots
- Slack integration for notifications
- Threshold-based alerts
- Cron-based scheduling
- Report logs and execution history
- Requires Celery workers (async task processing)

---

### 6. Managing Security and Access Control

**Description:** Administrators configure role-based access control (RBAC), row-level security (RLS), and authentication mechanisms to secure data and features.

**Key Components:**
- Backend: `superset/security/` - RBAC and authentication
- Backend: `superset/row_level_security/` - RLS rules
- Models: Flask-AppBuilder security models

**Features:**
- Role-based permissions (Admin, Alpha, Gamma, SQL Lab, Public)
- Row-level security (RLS) rules for data filtering
- Dataset and database-level permissions
- Integration with LDAP, OAuth, OIDC
- Custom security managers
- Guest token access for embedded dashboards

---

### 7. Semantic Layer and Metrics Management

**Description:** Users define reusable metrics, calculated columns, and dimensions at the dataset level to create a lightweight semantic layer.

**Key Components:**
- Backend: `superset/datasets/metrics/` - Metrics API
- Backend: `superset/datasets/columns/` - Columns API
- Frontend: Dataset editor UI

**Features:**
- SQL-based metric definitions
- Calculated columns with SQL expressions
- Aggregation functions (SUM, AVG, COUNT, etc.)
- Time-grain transformations
- Column type mappings
- Certified datasets and metrics

---

### 8. Embedding Superset in Applications

**Description:** Developers embed Superset dashboards and charts into external applications using iframes and guest tokens.

**Key Components:**
- Backend: `superset/embedded/` - Embedded dashboard API
- Backend: `superset/security/guest_token.py` - Guest token authentication
- Package: `superset-embedded-sdk/` - JavaScript SDK

**Features:**
- iframe-based embedding
- Guest token authentication with RLS
- Embedded SDK for easy integration
- Configurable permissions and filters
- Feature flag: `EMBEDDED_SUPERSET`

---

### 9. Customizing Visualizations with Plugins

**Description:** Developers create custom visualization plugins to extend Superset's charting capabilities beyond the built-in 50+ chart types.

**Key Components:**
- Packages: `superset-frontend/packages/` - Chart plugin packages
- Plugins: `superset-frontend/plugins/` - Visualization implementations
- Registry: `src/visualizations/presets/MainPreset.js` - Plugin registration

**Features:**
- Plugin architecture based on `@superset-ui` packages
- Support for custom chart types (ECharts, D3, deck.gl)
- Control panel configuration
- Query transformation and data mapping
- Dynamic plugin loading (feature flag: `DYNAMIC_PLUGINS`)

---

### 10. Caching and Performance Optimization

**Description:** Administrators configure multi-level caching (metadata, chart data, thumbnails) to optimize query performance and reduce database load.

**Key Components:**
- Backend: `superset/cachekeys/` - Cache key management
- Config: `superset/config.py` - Cache configuration
- Backend: `superset/tasks/` - Cache warming tasks

**Features:**
- Chart data caching with configurable TTL
- Multiple cache backends (Redis, Memcached, filesystem)
- Metadata caching for database schema
- Thumbnail caching for dashboards/charts
- Cache warming via Celery
- Cache key versioning

---

## Typical User Journeys

### Journey 1: Business Analyst Creating First Dashboard

**Persona:** Sarah, Business Analyst (no SQL knowledge)

**Goal:** Create a sales dashboard to monitor weekly revenue and top products

**Steps:**

1. **Connect to Data Source** (Admin/Data Engineer)
   - Navigate to Settings > Database Connections
   - Add PostgreSQL database connection
   - Test connection and save
   - Location: `superset/databases/api.py`

2. **Define Dataset** (Admin/Data Engineer)
   - Navigate to Data > Datasets
   - Select database and table (`sales_data`)
   - Configure columns and metrics (e.g., `SUM(revenue)` as "Total Revenue")
   - Save dataset
   - Location: `superset/datasets/api.py`

3. **Create First Chart: Revenue Over Time**
   - Click "Create Chart" from dataset or homepage
   - Select dataset (`sales_data`)
   - Choose "Line Chart" visualization
   - Configure:
     - Time column: `sale_date`
     - Time grain: `week`
     - Metric: `Total Revenue`
   - Click "Run Query" to preview
   - Save chart as "Weekly Revenue"
   - Location: `superset-frontend/src/explore/`

4. **Create Second Chart: Top Products**
   - Create new chart on same dataset
   - Choose "Bar Chart" visualization
   - Configure:
     - Dimension: `product_name`
     - Metric: `Total Revenue`
     - Sort: descending
     - Limit: 10
   - Save chart as "Top 10 Products"

5. **Build Dashboard**
   - Navigate to Dashboards > Create Dashboard
   - Click "Edit Dashboard"
   - Add charts via drag-and-drop from chart selector
   - Resize and position charts
   - Add title: "Sales Performance Dashboard"
   - Save dashboard
   - Location: `superset-frontend/src/dashboard/`

6. **Add Native Filters**
   - Click "Filter" button in dashboard edit mode
   - Add date range filter for `sale_date`
   - Add dropdown filter for `region`
   - Configure filter scope (which charts are affected)
   - Save dashboard

7. **Share Dashboard**
   - Click share icon
   - Copy dashboard link
   - Optionally schedule email report (Settings > Schedule)
   - Location: `superset/reports/api.py`

---

### Journey 2: Data Analyst Exploring Data with SQL

**Persona:** Mike, Data Analyst (proficient in SQL)

**Goal:** Investigate customer churn patterns by writing custom SQL queries

**Steps:**

1. **Open SQL Lab**
   - Navigate to SQL > SQL Lab
   - Select database from dropdown
   - Location: `superset-frontend/src/SqlLab/`

2. **Explore Database Schema**
   - Use left sidebar to browse tables
   - Click on `customers` table to view columns
   - Preview table data

3. **Write and Execute Query**
   - Write SQL in editor:
     ```sql
     SELECT
       DATE_TRUNC('month', last_purchase_date) as month,
       COUNT(*) as churned_customers
     FROM customers
     WHERE last_purchase_date < CURRENT_DATE - INTERVAL '90 days'
     GROUP BY 1
     ORDER BY 1 DESC
     ```
   - Click "Run" or press Ctrl+Enter
   - View results in results pane
   - Location: `superset/sql_lab.py`

4. **Visualize Query Results**
   - Click "Explore" button on results table
   - Superset creates temporary chart
   - Select "Line Chart" visualization
   - Adjust styling and formatting

5. **Save as Dataset**
   - Click "Save" > "Save Dataset"
   - Name: "Churned Customers by Month"
   - This creates a virtual dataset
   - Location: `superset/datasets/api.py`

6. **Create Dashboard from Query**
   - Save visualization as chart
   - Add to new or existing dashboard
   - Share findings with team

7. **Save Query for Reuse**
   - Click "Save" button in SQL Lab
   - Give query a name
   - Query is saved to query history
   - Can be shared via link

---

### Journey 3: Data Engineer Configuring Advanced Database Connection

**Persona:** Alex, Data Engineer

**Goal:** Set up Snowflake connection with SSH tunnel and configure dataset-level caching

**Steps:**

1. **Add Database Connection**
   - Navigate to Settings > Database Connections
   - Click "+ Database"
   - Select "Snowflake" from database type dropdown
   - Location: `superset/databases/api.py`

2. **Configure Connection Details**
   - Enter connection string:
     ```
     snowflake://user:password@account/database?warehouse=compute_wh&role=analyst_role
     ```
   - Test connection
   - Location: `superset/db_engine_specs/snowflake.py`

3. **Configure SSH Tunnel** (if required)
   - Enable SSH tunneling in Advanced settings
   - Provide SSH host, port, username, and private key
   - Feature flag: `SSH_TUNNELING`
   - Location: `superset/databases/ssh_tunnel/`

4. **Set Database Permissions**
   - Go to Security > List Roles
   - Grant database access to specific roles (Alpha, Gamma)
   - Configure row-level security (RLS) if needed
   - Location: `superset/security/`

5. **Create Datasets from Tables**
   - Navigate to Data > Datasets
   - Sync database schema
   - Select tables to expose as datasets
   - Location: `superset/datasets/api.py`

6. **Configure Dataset Caching**
   - Open dataset editor
   - Set cache timeout (e.g., 3600 seconds = 1 hour)
   - Optionally configure per-query caching
   - Location: `superset/config.py` - `DATA_CACHE_CONFIG`

7. **Define Metrics and Calculated Columns**
   - In dataset editor, add custom metrics:
     - Name: "Active Users"
     - Expression: `COUNT(DISTINCT CASE WHEN status='active' THEN user_id END)`
   - Add calculated columns with SQL expressions
   - Mark important metrics as "Certified"

8. **Test Performance**
   - Create test chart to verify caching
   - Monitor query execution time
   - Check cache hits via Superset logs

---

### Journey 4: Admin Scheduling Dashboard Reports

**Persona:** Jessica, BI Administrator

**Goal:** Set up weekly executive dashboard report delivered via email every Monday

**Steps:**

1. **Enable Alert/Report Feature**
   - Verify `ALERT_REPORTS` feature flag is enabled
   - Ensure Celery workers are running: `make report-celery-worker`
   - Location: `superset/config.py` - `FEATURE_FLAGS`

2. **Configure Email Settings**
   - Edit `superset_config.py`:
     ```python
     SMTP_HOST = 'smtp.gmail.com'
     SMTP_PORT = 587
     SMTP_USER = 'your-email@example.com'
     SMTP_PASSWORD = 'your-password'
     ```
   - Location: `superset/config.py`

3. **Create Report Schedule**
   - Open dashboard
   - Click "..." menu > "Set up an email report"
   - Configure:
     - Report name: "Executive Dashboard - Weekly"
     - Recipients: executive team emails
     - Schedule: Cron expression `0 9 * * 1` (Mondays at 9 AM)
     - Format: PDF or PNG screenshot
   - Location: `superset-frontend/src/features/reports/`

4. **Test Report**
   - Click "Send test report"
   - Verify email delivery
   - Check screenshot quality and layout

5. **Monitor Report Execution**
   - Navigate to Settings > Alerts & Reports
   - View execution logs
   - Check for failures or errors
   - Location: `superset/reports/api.py`, `superset/reports/logs/`

6. **Set Up Alerts** (Optional)
   - Create chart with metric threshold (e.g., revenue < $10,000)
   - Set up alert condition
   - Configure Slack or email notification
   - Location: `superset/reports/` - alert logic

---

### Journey 5: Developer Embedding Dashboard in External Application

**Persona:** David, Frontend Developer

**Goal:** Embed Superset dashboard in company's internal portal with filtered data per user

**Steps:**

1. **Enable Embedded Superset**
   - Set feature flag in config:
     ```python
     FEATURE_FLAGS = {
         "EMBEDDED_SUPERSET": True
     }
     ```
   - Location: `superset/config.py`

2. **Configure Dashboard for Embedding**
   - Open dashboard in Superset
   - Click "..." > "Embed Dashboard"
   - Add allowed domains: `https://internal-portal.company.com`
   - Save embedding configuration
   - Location: `superset/embedded/api.py`

3. **Set Up Guest Token Authentication**
   - Create API endpoint in backend to generate guest tokens
   - Configure RLS rules to filter data by user:
     ```python
     {
       "user_id": current_user.id,
       "resources": [{"type": "dashboard", "id": "dashboard-uuid"}],
       "rls": [{"clause": "user_id = {{current_user.id}}"}]
     }
     ```
   - Location: `superset/security/guest_token.py`

4. **Install Embedded SDK**
   - In external application:
     ```bash
     npm install @superset-ui/embedded-sdk
     ```
   - Location: `superset-embedded-sdk/`

5. **Embed Dashboard with SDK**
   - Add code to portal frontend:
     ```javascript
     import { embedDashboard } from "@superset-ui/embedded-sdk";

     embedDashboard({
       id: "dashboard-uuid",
       supersetDomain: "https://superset.company.com",
       mountPoint: document.getElementById("dashboard-container"),
       fetchGuestToken: () => fetchGuestTokenFromBackend(),
       dashboardUiConfig: {
         hideTitle: true,
         hideChartControls: true,
       }
     });
     ```

6. **Test Embedded Dashboard**
   - Verify dashboard renders in iframe
   - Test RLS filtering (each user sees only their data)
   - Verify cross-filtering and interactivity work
   - Location: `superset-frontend/src/embedded/`

7. **Deploy to Production**
   - Ensure CORS settings allow embedding domain
   - Monitor performance and error logs
   - Set up caching to reduce load

---

## Additional Use Cases (By Role)

### For Data Engineers
- Designing and implementing database connectors for custom databases
- Creating virtual datasets with complex SQL logic
- Implementing custom Jinja context variables for dynamic queries
- Configuring query cost estimation
- Setting up async query execution with Celery

### For Analysts
- Using Jinja templating in SQL Lab for parameterized queries
- Creating chart annotations for notable events
- Drilling down into chart data
- Exporting large datasets via CSV
- Collaborating via saved queries and shared dashboards

### For Developers
- Creating custom visualization plugins
- Extending Superset with custom database engine specs
- Implementing custom authentication providers
- Building embedded analytics experiences
- Contributing to open-source codebase

### For Administrators
- Managing user roles and permissions
- Monitoring system health and performance
- Configuring multi-tier caching strategies
- Setting up high availability with load balancers
- Implementing backup and disaster recovery

---

## Key Technical Flows

### Chart Rendering Flow
1. User configures chart in Explore view (`superset-frontend/src/explore/`)
2. Frontend sends query context to backend API (`superset/charts/api.py`)
3. Backend generates SQL via dataset model (`superset/datasets/`)
4. Query executed against database via SQLAlchemy
5. Results cached and returned to frontend
6. Visualization plugin transforms data (`superset-frontend/plugins/`)
7. Chart rendered in browser

### Dashboard Loading Flow
1. Dashboard page loads (`superset-frontend/src/dashboard/`)
2. Frontend fetches dashboard metadata via API (`superset/dashboards/api.py`)
3. Dashboard layout, filters, and chart IDs loaded
4. Parallel API calls made for all chart data
5. Results cached and rendered progressively
6. Native filters applied across charts
7. Cross-filtering enabled between charts

### SQL Lab Query Execution Flow
1. User writes SQL in SQL Lab editor (`superset-frontend/src/SqlLab/`)
2. Query submitted to backend (`superset/sql_lab.py`)
3. Backend validates query and checks permissions
4. For sync queries: execute immediately and return results
5. For async queries: dispatch to Celery worker
6. Results stored in results backend (Redis/S3)
7. Frontend polls for results or receives via WebSocket
8. Results displayed in table format with option to visualize

---

## Conclusion

Apache Superset provides a comprehensive BI platform with use cases spanning from simple chart creation to advanced embedded analytics. The codebase is organized around these core capabilities, with clear separation between frontend (TypeScript/React) and backend (Python/Flask) components.

New developers should start by exploring the key directories:
- **Backend:** `superset/dashboards/`, `superset/charts/`, `superset/datasets/`, `superset/sql_lab.py`
- **Frontend:** `superset-frontend/src/dashboard/`, `superset-frontend/src/explore/`, `superset-frontend/src/SqlLab/`
- **Config:** `superset/config.py`, `CLAUDE.md` (developer guide)

Understanding these core use cases and user journeys will provide a solid foundation for contributing to the codebase.
