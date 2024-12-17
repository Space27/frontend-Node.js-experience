import {Broker} from "../pages/brokers/brokers";

export class BrokerService {
    private baseUrl = 'http://localhost:3030';
    private brokerUrl = `${this.baseUrl}/broker`;

    getBrokers(): Promise<Broker[]> {
        return fetch(this.brokerUrl, {method: 'GET'})
            .then(res => res.json())
            .then(data => data as Broker[]);
    }

    deleteBroker(id: number) {
        return fetch(`${this.brokerUrl}/${id}`, {method: 'DELETE'});
    }

    addBroker(name: string, balance: number) {
        return fetch(this.brokerUrl, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                balance
            })
        });
    }

    updateBroker(id: number, balance: number) {
        return fetch(`${this.brokerUrl}/${id}`, {
            method: 'PATCH',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                balance
            })
        });
    }
}