import { Service, signal } from '@angular/core';

@Service()
export class BusyService {
    loading = signal(false);
    busyRequestCount = signal(0);

    busy() {
        this.busyRequestCount.update(prev => prev + 1);
        this.loading.set(true);
    }

    idle() {
        this.busyRequestCount.update(prev => prev - 1);
        if (this.busyRequestCount() <= 0) {
            this.busyRequestCount.set(0);
            this.loading.set(false);
        }
    }
}
