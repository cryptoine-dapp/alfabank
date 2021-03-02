/** Запрос регистрации заказа */
export interface Register {
  /** Номер (идентификатор) заказа в системе магазина, уникален для каждого магазина в пределах системы */
  orderNumber: string

  /** Сумма платежа в копейках (или центах) */
  amount: number

  /**Код валюты платежа ISO 4217. Если не указано, то используется значение по умолчанию. */
  currency?: string

  /** Адрес, на который требуется перенаправить пользователя в случае успешной оплаты. Адрес должен быть указан
   * полностью, включая используемый протокол (например, https://test.ru вместо test.ru). */
  returnUrl: string

  /** Адрес, на который требуется перенаправить пользователя в случае неуспешной оплаты.
   * Адрес должен быть указан полностью, включая используемый протокол (например, https://test.ru вместо test.ru).
   * В противном случае пользователь будет перенаправлен по адресу следующего вида: http://<адрес_платёжного_шлюза>/<адрес_продавца>.
   * */
  failUrl?: string

  /** Описание заказа в свободной форме. (Чтобы получить возможность отправлять это поле в процессинг, обратитесь в техническую поддержку.) */
  description?: string

  /** Язык в кодировке ISO 639-1. Если не указан, будет использован язык, указанный в настройках магазина как язык по умолчанию. */
  language?: string

  /** По значению данного параметра определяется, какие страницы платёжного интерфейса должны загружаться для клиента */
  pageView?: 'DESKTOP' | 'MOBILE' | string

  /** Номер (идентификатор) клиента в системе магазина. Используется для реализации функционала связок. Может присутствовать, если магазину разрешено создание связи */
  clientId?: string

  /** Чтобы зарегистрировать заказ от имени дочернего мерчанта, укажите его логин в этом параметре. */
  merchantLogin?: string

  /** Блок для передачи дополнительных параметров мерчанта.
   *  Включение данного функционала возможно по согласованию с банком в период интеграции.
   */
  jsonParams?: {
    email?: string
    phone?: string
  } & {
    [K: string]: string
  }

  /** Продолжительность жизни заказа в секундах.
   * В случае если параметр не задан, будет использовано значение, указанное в настройках мерчанта или время по умолчанию (1200 секунд = 20 минут).
   * Если в запросе присутствует параметр expirationDate, то значение параметра sessionTimeoutSecs не учитывается. */
  sessionTimeoutSecs?: number

  /**Дата и время окончания жизни заказа. Формат: yyyy-MM-dd'T'HH:mm:ss.
   * Если этот параметр не передаётся в запросе, то для определения времени окончания жизни заказа используется sessionTimeoutSecs . */
  expirationDate?: string

  /**Идентификатор связки, созданной ранее. Может использоваться, только если у магазина есть разрешение на работу
   * со связками. Если этот параметр передаётся в данном запросе, то это означает:
   * 1. Данный заказ может быть оплачен только с помощью связки;
   * 2. Плательщик будет перенаправлен на платёжную страницу, где требуется только ввод CVC. */
  bindingId?: string

  /** Контейнер для параметра feature, в котором можно указать следующие значения.
   * AUTO_PAYMENT - Если запрос на регистрацию заказа инициирует проведение автоплатежей.
   * FORCE_TDS - Принудительное проведение платежа с использованием 3-D Secure. Если карта не поддерживает 3-D Secure, транзакция не пройдёт.
   * FORCE_SSL - Принудительное проведение платежа через SSL (без использования 3-D Secure).
   * FORCE_FULL_TDS - После проведения аутентификации с помощью 3-D Secure статус PaRes должен быть только Y, что гарантирует успешную аутентификацию пользователя. В противном случае транзакция не пройдёт. */
  features?: string

  /** Электронная почта покупателя. */
  email?: string

  /** Номер телефона покупателя в следующем формате: +375333333333. */
  phone?: string

  /** Блок, содержащий Корзину товаров заказа. */
  orderBundle?: orderBundle
}

interface orderBundle {
  /** Дата создания заказа */
  orderCreationDate?: string

  /** Блок с атрибутами данных о покупателе. */
  customerDetails?: {
    email?: string
    phone?: string
    contact?: string

    /** Блок с атрибутами адреса для доставки. */
    deliveryInfo?: {
      deliveryType?: string
      country: string
      city: string
      postAddress: string
    }
  }

  /** Блок с атрибутами товарных позиции Корзины.  */
  cartItems: {
    /** Элемент массива с атрибутами товарной позиции в Корзине */
    items?: cartItems[]
  }
}

interface cartItems {
  /** Уникальный идентификатор товарной позиции внутри Корзины Заказа */
  positionId: number
  /** name да Наименование или описание товарной позиции в свободной форме */
  name: string

  /** Дополнительный блок с параметрами описания товарной позиции. */
  itemDetails?: {
    /** Параметр описывающий дополнительную информацию по товарной позиции. */
    itemDetailsParams: {
      /** Дополнительная информация по товарной позиции */
      value: string
      /** Наименование параметра описания детализации товарной позиции */
      name: string
    }[]
  }

  /** Элемент описывающий общее количество товарных позиций одного positionId и их меру измерения. */
  quantity: {
    /** Количество товарных позиций данного positionId. Для указания дробных чисел используйте десятичную точку. */
    value: number

    /** Мера измерения количества товарной позиции
     * @example pieces
     */
    measure: string
  }

  /** Сумма стоимости всех товарных позиций одного positionId в минимальных единицах валюты.
   * `itemAmount` обязателен к передаче, только если не был передан параметр `itemPrice`. В противном случае передача `itemAmount`
   * не требуется.
   * Если же в запросе передаются оба параметра: `itemPrice` и `itemAmount`, то `itemAmount` должен
   * равняться `itemPrice * quantity`, в противном случае запрос завершится с ошибкой.*/
  itemAmount?: number

  /** Сумма стоимости 1 товарной позиций одного positionId в минимальных единицах валюты */
  itemPrice?: number

  itemCurrency?: number

  /** Номер (идентификатор) товарной позиции в системе магазина. Параметр должен быть уникальным в рамках запроса. */
  itemCode: string

  discount?: {
    /** Тип скидки на товарную позицию
     * @example percent
     */
    discountType: string
    /** Значение скидки на товарную позицию */
    discountValue: number
  }
  agentInterest?: {
    /** Тип агентской комиссии за продажу товара */
    interestType: string
    /** Значение агентской комиссии за продажу товара */
    interestValue: string
  }
}

export type RegisterResponse = {
  /** Номер заказа в платежной системе. Уникален в пределах системы.
   * Отсутствует, если регистрация заказа на удалась по причине ошибки, детализированной в errorCode. */
  orderId?: string

  /** URL платежной формы, на который надо перенаправить браузер клиента.
   * Не возвращается, если регистрация заказа не удалась по причине ошибки, детализированной в errorCode. */
  formUrl?: string
}
