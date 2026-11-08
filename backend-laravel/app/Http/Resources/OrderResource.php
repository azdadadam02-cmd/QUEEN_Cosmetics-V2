<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    private const MESSAGES = [
        'En attente' => 'Votre commande a bien été reçue. Elle attend la validation de notre équipe.',
        'Acceptee'   => 'Bonne nouvelle ! Votre commande a été acceptée et est en préparation.',
        'Refusee'    => "Désolé, votre commande n'a pas pu être acceptée. Contactez-nous pour plus d'informations.",
        'Livree'     => 'Votre commande a été livrée. Merci de votre confiance !',
    ];

    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'date'           => $this->date_commande?->toIso8601String(),
            'total'          => (float) $this->total,
            'status'         => $this->statut,
            'status_message' => self::MESSAGES[$this->statut] ?? '',
            'is_new'         => $this->statut_vu !== $this->statut,
            'next_statuses'  => \App\Models\Order::TRANSITIONS[$this->statut] ?? [],
            'delivery'       => [
                'name'    => $this->nom_livraison,
                'phone'   => $this->telephone,
                'city'    => $this->ville,
                'address' => $this->adresse,
            ],
            'payment' => $this->whenLoaded('payment', fn () => $this->payment ? [
                'method' => $this->payment->methode,
                'status' => $this->payment->statut,
                'amount' => (float) $this->payment->montant,
            ] : null),
            'client' => $this->whenLoaded('client', fn () => $this->client ? [
                'id'    => $this->client->id,
                'name'  => $this->client->nom,
                'email' => $this->client->email,
            ] : null),
            'items' => OrderItemResource::collection($this->whenLoaded('items')),
        ];
    }
}
