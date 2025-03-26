# NestJS Todo-List Application with ELK Logging

This project is a todo-list application built with NestJS, using MongoDB as the database. It logs CRUD (Create, Read, Update, Delete) operations, which are captured by Filebeat and shipped to the ELK stack (Elasticsearch, Logstash, Kibana) for visualization. All services are containerized with Docker and orchestrated using Docker Compose for easy setup and deployment.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Build and Run Instructions](#build-and-run-instructions)
- [Why Dockerize Each Service?](#why-dockerize-each-service)
- [Accessing the Kibana Dashboard](#accessing-the-kibana-dashboard)
- [Kibana Dashboard Description](#kibana-dashboard-description)

---

## Prerequisites
Before you begin, ensure the following are installed on your machine:
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

---

## Build and Run Instructions
Follow these steps to build and run the application locally:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ngunq/nestjs-todo-list
   cd nestjs-todo-list
   ```

2. **Build and start the services**:
   Use Docker Compose to build and launch all services:
   ```bash
   docker-compose up --build -d
   ```
   - This command builds the NestJS app, starts MongoDB, Filebeat, Elasticsearch, and Kibana in detached mode (`-d`).

3. **Verify the services**:
   Once running, the services are accessible at:
   - **NestJS App**: `http://localhost:3000`
   - **MongoDB**: Port `27017`
   - **Elasticsearch**: Port `9200`
   - **Kibana**: `http://localhost:5601`

4. **Interact with the API**:
   Test the CRUD operations using tools like Postman or curl:
   - **Create a task**:
     ```bash
     curl -X POST -H "Content-Type: application/json" -d '{"title":"Buy groceries"}' http://localhost:3000/tasks
     ```
   - **Get all tasks**:
     ```bash
     curl http://localhost:3000/tasks
     ```
   - **Update a task**:
     ```bash
     curl -X PATCH -H "Content-Type: application/json" -d '{"status":"completed"}' http://localhost:3000/tasks/<task-id>
     ```
   - **Delete a task**:
     ```bash
     curl -X DELETE http://localhost:3000/tasks/<task-id>
     ```

5. **Stop the services**:
   To shut down all services and clean up:
   ```bash
   docker-compose down
   ```

---

## Why Dockerize Each Service?
Dockerizing each service ensures consistency, portability, and simplified dependency management. Here’s why each component is containerized:

- **NestJS App**:
  - **Consistency**: Guarantees the app runs identically across development, testing, and production environments.
  - **Dependency Management**: Bundles Node.js and other dependencies within the container, avoiding version conflicts on the host.
  - **Portability**: Allows deployment to any Docker-compatible system without OS-specific adjustments.

- **MongoDB**:
  - **Isolation**: Runs in its own container, preventing interference with other databases or MongoDB instances on the host.
  - **Version Control**: Locks the MongoDB version (e.g., `mongo` image) to match the app’s requirements.
  - **Data Persistence**: Uses a volume (`mongo-data`) to retain data across container restarts.

- **Filebeat**:
  - **Scalability**: Runs as a lightweight container to collect logs from Dockerized services, making it easy to scale or replicate.
  - **Isolation**: Separates log collection from the app, enhancing modularity.
  - **Dependency Management**: Includes all Filebeat dependencies in the container, avoiding host-level setup.

- **Elasticsearch**:
  - **Simplified Setup**: Avoids manual installation and configuration, providing a pre-configured instance.
  - **Resource Control**: Allows resource limits (e.g., CPU, memory) to be set via Docker.
  - **Portability**: Moves seamlessly across environments without reconfiguration.

- **Kibana**:
  - **Ease of Use**: Offers a pre-built visualization tool with no manual setup required.
  - **Integration**: Connects effortlessly to the Elasticsearch container for log visualization.
  - **Consistency**: Ensures compatibility with the Elasticsearch version used.

---

## Accessing the Kibana Dashboard
To view the visualized logs in Kibana, follow these steps:

1. **Open Kibana**:
   - In your browser, go to `http://localhost:5601`.

2. **Set Up the Index Pattern**:
   - Navigate to **Management** > **Index Patterns** (under "Kibana" section).
   - Click **Create index pattern**.
   - Enter `filebeat-*` as the index pattern name (this matches logs collected by Filebeat).
   - Select `@timestamp` as the time field and click **Create**.


---

## Kibana Dashboard Description
The Kibana dashboard visualizes the number of CRUD operations performed in the todo-list application over time. Below are the key components:

### **Line Chart: CRUD Operations Over Time**:
  - **Purpose**: Displays trends in CRUD operations (e.g., task creation, updates, deletions) over time.
  - **Description**: A line chart with separate lines for each operation type ("create", "read", "update", "delete"), showing activity peaks during usage.
  This line chart will display the number of CRUD operations (create, read, update, delete) over time, with each operation type as a separate line.

1. **Navigate to Visualize**:
   - Click **Visualize** in the left sidebar.
   - Select **Create new visualization**.
   - Choose **Line**.

2. **Select Your Index**:
   - Pick the index pattern you created (e.g., `filebeat-*`).

3. **Configure the Metrics**:
   - **Y-Axis**: Select **Count** to count the number of log entries.

4. **Set Up the Buckets**:
   - **X-Axis**:
     - Select **Date Histogram**.
     - Choose the `@timestamp` field.
     - Set the **Interval** to "Auto" (or a specific value like "Hourly").
   - **Split Series**:
     - Under Buckets, click **Add**.
     - Select **Split series**.
     - Choose **Terms** aggregation.
     - Select the field for operation type (e.g., `operation`).
     - Set **Size** to 4 (for create, read, update, delete) or adjust as needed.
  

5. **Save the Visualization**:
   - Click **Apply changes** (play button).
   - Click **Save**, name it "CRUD Operations Over Time", and save.

*Note:* If can't find `operation` field in Term aggreation, navigate to **Management** > **Index Patterns**, select `filebeat-*` index parttern and click refresh icon on right top corner to refresh field list. Then, try to search `operation` field in search box to confirm this field exists

![alt text](<Screen Shot 2025-03-26 at 10.39.22.png>)

### **Pie Chart: Operation Distribution**:
  - **Purpose**: Shows the proportion of each CRUD operation type.
  - **Description**: A pie chart with slices representing the relative frequency of each operation (e.g., 40% create, 30% read, etc.).
1. **Create a New Visualization**:
   - Go to **Visualize** > **Create new visualization**.
   - Select **Pie**.

2. **Select Your Index**:
   - Choose your index pattern (e.g., `filebeat-*`).

3. **Configure the Metrics**:
   - **Metrics**: Select **Count**.

4. **Set Up the Buckets**:
   - **Split Slices**:
     - Choose **Terms** aggregation.
     - Select the `operation` field.
     - Set **Size** to 4 (or the number of unique operations).

5. **Save the Visualization**:
   - Click **Apply changes**.
   - Click **Save**, name it "Operation Distribution", and save.

![alt text](<Screen Shot 2025-03-26 at 10.38.10.png>)

### Build the Dashboard
Combine the visualizations into a single dashboard for a unified view.

1. **Navigate to Dashboard**:
   - Click **Dashboard** in the left sidebar.
   - Select **Create new dashboard**.

2. **Add Visualizations**:
   - Click **Add** in the top panel.
   - Select your visualizations:
     - "CRUD Operations Over Time"
     - "Operation Distribution"

3. **Arrange the Panels**:
   - Drag and resize the panels to your preferred layout (e.g., line chart at the top, pie chart and table side by side below).

4. **Set the Time Range**:
   - Use the time picker at the top-right to set a time range (e.g., "Last 7 days").

5. **Save the Dashboard**:
   - Click **Save**, name it "Todo-List Monitoring" (or another name), and save.

![alt text](<Screen Shot 2025-03-26 at 11.20.43.png>)
---

### Notes
- **Log Collection**: Filebeat collects logs from the NestJS app container, enabled via the `co.elastic.logs/enabled=true` label in the `docker-compose.yml`.
- **ELK Stack**: Logs are sent to Elasticsearch by Filebeat and visualized in Kibana.
- **Data Persistence**: MongoDB data is stored in the `mongo-data` volume to persist across container restarts.

For further details or troubleshooting, consult the [NestJS documentation](https://docs.nestjs.com/) or [Elastic documentation](https://www.elastic.co/guide/index.html).
