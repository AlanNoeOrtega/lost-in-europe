# Kevin McCallister is Lost in Europe - Tickets API

This project is a NestJS-based API for sorting travel tickets and retrieving itinerary instructions. It provides endpoints to sort an array of tickets and to fetch a human-readable itinerary by identifier.

## Prerequisites

- Node.js (v18 or higher recommended)
- npm
- MySQL (there is a compose.dev.yml to create a container with docker)
- Docker

## Installation

```bash
npm install
```

## Running the Application

1. MySQL (Docker)

```bash
docker compose -f compose.dev.yml up -d
```

2. Start for dev

```bash
npm run start:dev
```

The API will be available at `http://localhost:3000` by default.

## API Documentation

Swagger UI is available at:

```
http://localhost:3000/api
```

## Running Tests

```bash
npm run test
```

## Example Usage

### 1. Sort Tickets

**Endpoint:** `POST /tickets/sort`

**Request Body:**

```json
{
  "tickets": [
    {
      "type": "airplane",
      "from": "Innsbruck Airport",
      "to": "Venice Airport",
      "details": {
        "flight": "AA904",
        "gate": "10",
        "seat": "18B"
      }
    },
    {
      "type": "tram",
      "from": "Innsbruck Hbf",
      "to": "Innsbruck Airport",
      "details": {
        "tram": "S5"
      }
    },
    {
      "type": "train",
      "from": "St Anton am Arlberg Bahnhof",
      "to": "Innsbruck Hbf",
      "details": {
        "platform": "1",
        "train": "RJX 765",
        "seat": "17C"
      }
    }
  ]
}
```

**Response:**

```json
{
  "tickets": [
    {
      "type": "train",
      "from": "St Anton am Arlberg Bahnhof",
      "to": "Innsbruck Hbf",
      "details": {
        "platform": "1",
        "train": "RJX 765",
        "seat": "17C"
      }
    },
    {
      "type": "tram",
      "from": "Innsbruck Hbf",
      "to": "Innsbruck Airport",
      "details": {
        "tram": "S5"
      }
    },
    {
      "type": "airplane",
      "from": "Innsbruck Airport",
      "to": "Venice Airport",
      "details": {
        "flight": "AA904",
        "gate": "10",
        "seat": "18B"
      }
    }
  ],
  "identifier": 3
}
```

### 2. Get Itinerary

**Endpoint:** `GET /tickets/itinerary/{id}`

**Response:**

```json
{
  "itinerary": [
    "0. Start.",
    "1. Boar train RJX 765, Platform 1 from St Anton am Arlberg Bahnhof to Innsbruck Hbf. Seat number 17C.",
    "2. Board the Tram S5 from Innsbruck Hbf to Innsbruck Airport.",
    "3. From Innsbruck Airport, board flight AA904 to Venice Airport from gate 10, seat 18B.",
    "4. Last destination reached."
  ]
}
```

## Add new types of transit

Two parts are important to keep in mind to add a new type of transit, the input validation and the instructions for the itinerary.

### Adding input validation for the new type of transit

All tickets have `type`, `from` and `to`, properties, additionally they differ on the `details` property.

1. Add a new details dto (`src/tickets/dto/details`) with all the required extra fields for your type of transit, for example, `taxiCompanyName` if the ticket is to take a taxi.
2. Add the new details type as a possible value for `TicketDto`(`ticket.dto.ts`) `details` property and validations.
3. Don't forget to add/update swagger decorators for documentation

### Adding itinerary instructions for the new type of transit

You'll need to modify `src/tickets/utils/ticket-to-instructions.ts` add a new template to write instructions for your new type of transit.

---

For more details, see the Swagger UI or the source code.
