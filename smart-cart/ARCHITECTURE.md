# SmartCart System Architecture

## 1. System Overview

SmartCart is a modern e-commerce platform built with a three-tier architecture:
- Frontend (Angular)
- Backend (Node.js/Express)
- Database (PostgreSQL)

## 2. Architecture Diagram

```mermaid
graph TB
    subgraph Frontend [Frontend - Angular]
        UI[User Interface]
        Components[Components]
        Services[Services]
        State[State Management]
    end

    subgraph Backend [Backend - Node.js/Express]
        API[API Layer]
        Controllers[Controllers]
        Services[Services]
        Middleware[Middleware]
    end

    subgraph Database [Database - PostgreSQL]
        Users[(Users)]
        Products[(Products)]
        Orders[(Orders)]
        Cart[(Cart Items)]
    end

    UI --> Components
    Components --> Services
    Services --> State
    State --> API
    API --> Controllers
    Controllers --> Services
    Services --> Middleware
    Middleware --> Database
```

## 3. Component Details

### 3.1 Frontend (Angular)

#### Core Components
- **User Interface Layer**
  - Product Catalog
  - Shopping Cart
  - Checkout Process
  - User Authentication
  - Admin Dashboard

#### Services
- **API Services**
  - ProductService
  - CartService
  - OrderService
  - AuthService
  - UserService

#### State Management
- **Angular Services**
  - Cart State
  - User State
  - Product State

### 3.2 Backend (Node.js/Express)

#### API Layer
- **RESTful Endpoints**
  - /api/auth
  - /api/products
  - /api/cart
  - /api/orders
  - /api/users

#### Controllers
- AuthController
- ProductController
- CartController
- OrderController
- UserController

#### Services
- Authentication Service
- Product Service
- Cart Service
- Order Service
- User Service

#### Middleware
- Authentication Middleware
- Error Handling Middleware
- Request Validation Middleware
- Logging Middleware

### 3.3 Database (PostgreSQL)

#### Schema Design
```sql
-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products Table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock INTEGER NOT NULL,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders Table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order Items Table
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL
);

-- Cart Items Table
CREATE TABLE cart_items (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 4. Data Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Database

    User->>Frontend: Interacts with UI
    Frontend->>Backend: API Request
    Backend->>Backend: Process Request
    Backend->>Database: Query/Update Data
    Database->>Backend: Return Data
    Backend->>Frontend: API Response
    Frontend->>User: Update UI
```

## 5. Security Architecture

### 5.1 Authentication Flow
```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Database

    User->>Frontend: Login Request
    Frontend->>Backend: POST /api/auth/login
    Backend->>Database: Verify Credentials
    Database->>Backend: User Data
    Backend->>Backend: Generate JWT
    Backend->>Frontend: JWT Token
    Frontend->>Frontend: Store Token
```

### 5.2 Authorization
- Role-based access control (RBAC)
- JWT-based authentication
- Secure password hashing with bcrypt
- CORS protection
- Input validation and sanitization

## 6. Error Handling

### 6.1 Error Flow
```mermaid
graph TD
    A[Error Occurs] --> B{Error Type}
    B -->|Validation| C[400 Bad Request]
    B -->|Authentication| D[401 Unauthorized]
    B -->|Authorization| E[403 Forbidden]
    B -->|Not Found| F[404 Not Found]
    B -->|Server Error| G[500 Internal Server Error]
    C --> H[Error Response]
    D --> H
    E --> H
    F --> H
    G --> H
    H --> I[Frontend Error Handler]
    I --> J[User Notification]
```

## 7. Scalability Considerations

1. **Horizontal Scaling**
   - Stateless backend design
   - Load balancing ready
   - Database connection pooling

2. **Performance Optimization**
   - Database indexing
   - Caching strategies
   - Lazy loading in frontend
   - API response compression

3. **Monitoring and Logging**
   - Request logging
   - Error tracking
   - Performance metrics
   - User activity monitoring

## 8. Development Workflow

```mermaid
graph LR
    A[Development] --> B[Testing]
    B --> C[Code Review]
    C --> D[Staging]
    D --> E[Production]
```

## 9. Deployment Architecture

```mermaid
graph TB
    subgraph Production
        LB[Load Balancer]
        subgraph Backend Servers
            BS1[Backend Server 1]
            BS2[Backend Server 2]
        end
        subgraph Database
            Primary[(Primary DB)]
            Replica[(DB Replica)]
        end
    end
    LB --> BS1
    LB --> BS2
    BS1 --> Primary
    BS2 --> Primary
    Primary --> Replica
``` 