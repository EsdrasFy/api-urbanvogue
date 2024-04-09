export interface MPPixResponse {
  data: {
    id: number;
    date_created: Date | null;
    date_approved: Date | null;
    date_last_updated: Date | null;
    date_of_expiration: Date | null;
    money_release_date: string | null;
    money_release_status: string;
    operation_type: string;
    issuer_id: string;
    payment_method_id: string;
    payment_type_id: string;
    payment_method: {
      id: string;
      type: string;
      issuer_id: string;
    };
    status: string;
    status_detail: string;
    currency_id: string;
    description: string | null;
    live_mode: boolean;
    sponsor_id: string | null;
    authorization_code: string | null;
    money_release_schema: string | null;
    taxes_amount: number;
    counter_currency: string | null;
    brand_id: string | null;
    shipping_amount: number;
    build_version: string;
    pos_id: string | null;
    store_id: string | null;
    integrator_id: string | null;
    platform_id: string | null;
    corporation_id: string | null;
    payer: {
      identification: {
        number: string | null;
        type: string | null;
      };
      entity_type: string | null;
      phone: {
        number: string | null;
        extension: string | null;
        area_code: string | null;
      };
      last_name: string | null;
      id: string;
      type: string | null;
      first_name: string | null;
      email: string | null;
    };
    collector_id: number;
    marketplace_owner: string | null;
    metadata: object;
    additional_info: {
      available_balance: string | null;
      nsu_processadora: string | null;
      authentication_code: string | null;
    };
    order: object;
    external_reference: string | null;
    transaction_amount: number;
    transaction_amount_refunded: number;
    coupon_amount: number;
    differential_pricing_id: string | null;
    financing_group: string | null;
    deduction_schema: string | null;
    callback_url: string | null;
    installments: number;
    transaction_details: {
      payment_method_reference_id: string | null;
      acquirer_reference: string | null;
      net_received_amount: number;
      total_paid_amount: number;
      overpaid_amount: number;
      external_resource_url: string | null;
      installment_amount: number;
      financial_institution: string | null;
      payable_deferral_period: string | null;
      bank_transfer_id: string | null;
      transaction_id: string | null;
    };
    fee_details: Array<object>;
    charges_details: Array<{
      id: string;
      name: string;
      type: string;
      accounts: {
        from: string;
        to: string;
      };
      client_id: number;
      date_created: Date | null;
      last_updated: Date | null;
      amounts: {
        original: number;
        refunded: number;
      };
      metadata: object;
      reserve_id: string | null;
      refund_charges: Array<object>;
    }>;
    captured: boolean;
    binary_mode: boolean;
    call_for_authorize_id: string | null;
    statement_descriptor: string | null;
    card: object;
    notification_url: string;
    refunds: Array<object>;
    processing_mode: string;
    merchant_account_id: string | null;
    merchant_number: string | null;
    acquirer_reconciliation: Array<object>;
    point_of_interaction: {
      type: string;
      business_info: {
        unit: string;
        sub_unit: string;
        branch: string | null;
      };
      location: {
        state_id: string | null;
        source: string | null;
      };
      application_data: {
        name: string | null;
        version: string | null;
      };
      transaction_data: {
        qr_code: string;
        bank_transfer_id: string | null;
        transaction_id: string | null;
        e2e_id: string | null;
        financial_institution: string | null;
        ticket_url: string;
        bank_info: {
          payer: {
            account_id: string | null;
            id: string | null;
            long_name: string | null;
            account_holder_name: string | null;
            identification: {
              number: string | null;
              type: string | null;
            };
            external_account_id: string | null;
          };
          collector: {
            account_id: string | null;
            long_name: string | null;
            account_holder_name: string;
            transfer_account_id: string | null;
          };
        };
      };
    };
  };
}

