
export async function registerBiometricCredential(): Promise<string | null> {
  try {
    const challenge = new Uint8Array(32); // Un desafío aleatorio del servidor/contrato
    crypto.getRandomValues(challenge);

    const userId = new Uint8Array(16); // ID único del usuario (ej. hash de su dirección)
    crypto.getRandomValues(userId);

    const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
      challenge: challenge,
      rp: { name: 'Revita Chain', id: window.location.hostname },
      user: {
        id: userId,
        name: 'user@revitachain.xyz',
        displayName: Usuario Revita Chain,
      },
      pubKeyCredParams: [
        { alg: -7, type: 'public-key' }, // ES256
        { alg: -257, type: 'public-key' }, // RS256
      ],
      authenticatorSelection: {
        authenticatorAttachment: 'platform',
        userVerification: 'required',
      },
      timeout: 60000,
      attestation: 'direct',
    };

    const credential = await navigator.credentials.create({
      publicKey: publicKeyCredentialCreationOptions,
    });

    if (credential instanceof PublicKeyCredential) {
      const rawIdHex = Array.from(new Uint8Array(credential.rawId))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
      return rawIdHex; 
    }
    return null;
  } catch (error) {
    console.error('Error al registrar credencial biométrica:', error);
    return null;
  }
}

export async function verifyBiometricCredential(): Promise<boolean> {
  try {
    const challenge = new Uint8Array(32); // Un desafío aleatorio del servidor/contrato
    crypto.getRandomValues(challenge);

    const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
      challenge: challenge,
      allowCredentials: [
        { type: 'public-key', id: new Uint8Array(16) }, // Aquí iría el rawId de la credencial registrada
      ],
      userVerification: 'required',
      timeout: 60000,
    };

    const assertion = await navigator.credentials.get({
      publicKey: publicKeyCredentialRequestOptions,
    });

    // En un escenario real, enviarías 'assertion' al backend para verificarlo criptográficamente.
    // Para este MVP, asumimos que si llegamos aquí, la verificación del navegador fue exitosa.
    return !!assertion;
  } catch (error) {
    console.error('Error al verificar credencial biométrica:', error);
    return false;
  }
}


