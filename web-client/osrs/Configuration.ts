export class Configuration {

    /**
     * IP Address or Hostname of the server to establish a connection.
     */
    public static SERVER_ADDRESS: string = "127.0.0.1"; //127.0.0.1

    /**
     * Port for establishing a connection to the game server.
     */
    public static GAME_PORT: number = 43594;

    /**
     * Port for establishing a connection to the update server.
     */
    public static JAGGRAB_PORT: number = 43595;

    /**
     * Port for establishing a backup connection to the update
     * server in case the initial JAGGRAB connection fails.
     */
    public static HTTP_PORT: number = 8080;

    /**
     * Whether or not the update server should be used.
     */
    public static JAGGRAB_ENABLED: boolean = false;

    /**
     * Whether or not the network packets should be encrypted.
     */
    public static RSA_ENABLED: boolean = true;

    /**
     * Public key to be used in RSA network encryption.
     */
    public static RSA_PUBLIC_KEY: string = "65537";
    /**
     * Modulus to be used in the RSA network encryption.
     */
    public static RSA_MODULUS: string = "119568088839203297999728368933573315070738693395974011872885408638642676871679245723887367232256427712869170521351089799352546294030059890127723509653145359924771433131004387212857375068629466435244653901851504845054452735390701003613803443469723435116497545687393297329052988014281948392136928774011011998343"; 

    // // Apollo RSA
    // public static RSA_MODULUS: string = "108379346388289621523168245756122175547534169913919004759825566746459856287947206420339634177180298532228051728138705489847063516095693907342044187695765892796220367349571343246924783829061652170357790130207366276675834763654089599253213422277047010246099055984181407502946476233595255290168731010748785532939"; 
}
