class BrokerService {
  baseUrl = 'http://localhost:3030';
  brokerUrl = `${this.baseUrl}/broker`;

  getBrokerId(name) {
    return fetch(`${this.brokerUrl}/name`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({name})
    })
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error();
        }
      })
  }

  getBroker(id) {
    return fetch(`${this.brokerUrl}/${id}`)
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error();
        }
      })
  }

  getBrokers() {
    return fetch(`${this.brokerUrl}`)
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error();
        }
      })
  }

  buyStocks(id, symbol, count) {
    return fetch(`${this.brokerUrl}/buy`, {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({id, symbol, count})
    })
  }

  sellStocks(id, symbol, count) {
    return fetch(`${this.brokerUrl}/sell`, {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({id, symbol, count})
    })
  }
}

export default new BrokerService();
