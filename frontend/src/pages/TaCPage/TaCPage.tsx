import { Flex , Text} from "@chakra-ui/react";
import { BaseLayout } from "../../layout/BaseLayout";
import { Navbar } from "../generalComponents/Navbar";

export const TaCPage = () => {
    return (
      <BaseLayout>
        <Navbar></Navbar>
        <Flex height={"100vh"} mt={"5em"} ml={"1.5em"} mb={"5em"}>
          <Text color={"white"}>
            Terms and Conditions for Melody Mingle <br />
            Last Updated: August 2024 <br />
            <br />
            1. Scope <br />
            1.1 These Terms and Conditions (T&C) apply to the use of the online platform Melody Mingle
            (hereinafter referred to as the "Platform"), operated by MM GmbH, D-Town (hereinafter referred to as the "Operator" or "we").
            <br />
            1.2 By registering on our platform, you agree to these T&C. We do not recognize any differing
            conditions set forth by the user unless we expressly agree to their validity. <br />
            <br />
            2. Service Description <br />
            2.1 Melody Mingle is a social network focused on connecting people through their love of
            music. Users can create profiles, import their favorite music via Spotify, and interact with
            others whose music tastes inspire them.

            <br />
            <br /> 3. Registration and User Account
            <br /> 3.1 Registration is required to use the platform. The user agrees to provide truthful
            and complete information during the registration process.
            <br /> 3.2 Each user is responsible for maintaining the confidentiality of their login
            credentials and for protecting access to their account from unauthorized third parties.
            <br /> 3.3 The Operator reserves the right to suspend or delete user accounts if there is a
            violation of these T&C or if there is suspicion of such a violation.
            <br />
            <br /> 4. Use of the Platform
            <br /> 4.1 Users may only use the platform for private, non-commercial purposes. <br />
            4.2 It is prohibited to upload, share, or otherwise distribute content that violates
            applicable laws, is obscene, offensive, defamatory, or otherwise inappropriate. <br />
            4.3 The Operator reserves the right to remove content that violates these T&C and may take
            legal action if necessary. <br />
            <br />
            5. User Rights and Obligations
            <br /> 5.1 The user is solely responsible for all content they publish on the platform. The
            user ensures that they have all necessary rights to the content they upload. <br />
            5.2 By uploading content, the user grants the Operator a simple, perpetual, and
            geographically unrestricted right to use, publish, and distribute the content on the
            platform.
            <br />
            <br /> 6. Data Protection
            <br /> 6.1 The protection of our users' personal data is very important to us. The
            collection, processing, and use of personal data are conducted in accordance with applicable
            data protection laws and our Privacy Policy.
            <br /> 6.2 For more information on how we handle personal data, please refer to our Privacy
            Policy.
            <br />
            <br />
            7. Liability <br />
            7.1 The Operator is not liable for the accuracy, completeness, or timeliness of the content
            provided on the platform. <br />
            7.2 The Operator is fully liable only for damages caused by intentional or gross negligence.
            For slight negligence, the Operator is only liable in the event of a breach of an essential
            contractual obligation (cardinal obligation), and in such cases, liability is limited to
            foreseeable, contract-typical damages. <br />
            7.3 Liability for damages caused by misuse of the platform by third parties is excluded.{" "}
            <br />
            <br />
            8. Changes to the T&C <br />
            8.1 The Operator reserves the right to change these T&C at any time with future effect.
            <br /> 8.2 Users will be informed of any significant changes in advance via email. If the
            user does not object to the amended terms within 14 days of receiving the notification, the
            changes are considered accepted. <br />
            <br />
            9. Termination and Deletion of User Account <br />
            9.1 The user may terminate and delete their account at any time without providing any reason.{" "}
            <br />
            9.2 The Operator reserves the right to terminate the user’s account if the user violates
            these T&C. <br />
            <br />
            10. Final Provisions <br />
            10.1 The law of the Federal Republic of Germany applies, excluding the UN Convention on
            Contracts for the International Sale of Goods (CISG). <br />
            10.2 Should any provision of these T&C be or become invalid or unenforceable, the validity of
            the remaining provisions shall remain unaffected. <br />
            10.3 The place of jurisdiction for all disputes arising from or in connection with these T&C
            is the location of the Operator's headquarters, provided the user is a merchant, a legal
            entity under public law, or a special fund under public law.
          </Text>
        </Flex>
      </BaseLayout>
    );
    }