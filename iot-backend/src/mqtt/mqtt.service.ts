import { Injectable, OnModuleInit } from '@nestjs/common';
import * as mqtt from 'mqtt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SensorData } from '../sensors/sensor-data.entity';

interface QueryFilters {
  from?: string;
  to?: string;
  limit?: number;
}

@Injectable()
export class MqttService implements OnModuleInit {
    private client: mqtt.MqttClient;
    private readonly topic = 'ricardo/sensors/temperature-humidity';
    private messages: any[] = []; // almacenamiento en memoria

    constructor(
        @InjectRepository(SensorData)
        private readonly sensorRepo: Repository<SensorData>,
    ) { }

    onModuleInit() {
        this.client = mqtt.connect('mqtt://broker.hivemq.com:1883', {
            clientId: 'ricardo-nestjs-subscriber-' + Math.random().toString(16).substr(2, 8),
        });

        this.client.on('connect', () => {
            console.log('✅ NestJS MQTT Subscriber conectado');
            this.client.subscribe(this.topic, (err) => {
                if (!err) {
                    console.log(`📡 Suscrito al topic: ${this.topic}`);
                }
            });
        });

        this.client.on('message', async (topic, message) => {
            try {
                const data = JSON.parse(message.toString());
                console.log('📥 Guardando en DB:', data);

                const entity = this.sensorRepo.create({
                    temperature: parseFloat(data.temperature),
                    humidity: parseFloat(data.humidity),
                });
                await this.sensorRepo.save(entity);
            } catch (e) {
                console.error('⚠️ Error parseando mensaje:', message.toString());
            }
        });
    }


    async getMessages(filters: QueryFilters): Promise<SensorData[]> {
        const query = this.sensorRepo.createQueryBuilder('sensor');

        if (filters.from) {
            query.andWhere('sensor.timestamp >= :from', {
                from: new Date(filters.from),
            });
        }

        if (filters.to) {
            query.andWhere('sensor.timestamp <= :to', {
                to: new Date(filters.to),
            });
        }

        query.orderBy('sensor.timestamp', 'DESC');

        if (filters.limit) {
            query.take(filters.limit);
        }

        return query.getMany();
    }
}